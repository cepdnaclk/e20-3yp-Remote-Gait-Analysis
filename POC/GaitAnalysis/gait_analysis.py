import asyncio
import websockets
import json
import numpy as np
from datetime import datetime
from collections import deque

# Configuration
WEBSOCKET_URI = "ws://your-server-address:port"
HEEL_SENSORS = ["FSR_2", "FSR_3", "FSR_4", "FSR_10"]
TOE_SENSORS = ["FSR_6", "FSR_7", "FSR_8", "FSR_9", "FSR_16"]

# Thresholds (calibrate these for your setup)
HEEL_FORCE_THRESHOLD = 15  # Newtons
TOE_FORCE_THRESHOLD = 5    # Newtons
GYRO_MOVING_THRESHOLD = 2.5  # rad/s
PITCH_LIFT_THRESHOLD = 10   # degrees
STATIONARY_GYRO_THRESHOLD = 0.3  # rad/s
FLAT_PITCH_THRESHOLD = 5     # degrees
ZUPT_WINDOW = 0.2           # seconds for zero-velocity updates

class GaitProcessor:
    def __init__(self):
        # Sensor buffers
        self.gyro_buffer = deque(maxlen=5)
        self.pitch_buffer = deque(maxlen=5)
        self.accel_buffer = deque(maxlen=5)
        
        # Gait state tracking
        self.state_machine = GaitStateMachine()
        self.stride_length = 0.0
        self.velocity = np.zeros(3)
        self.position = np.zeros(3)
        self.last_zupt = datetime.now().timestamp()
        
        # Stride calculation buffers
        self.accel_history = []
        self.timestamps = []

    def quaternion_to_pitch(self, q):
        """Convert quaternion to pitch angle in degrees"""
        q0, q1, q2, q3 = q
        sin_p = 2.0 * (q0 * q2 - q3 * q1)
        return np.degrees(np.arcsin(sin_p))

    def rotate_acceleration(self, accel, quaternion):
        """Rotate acceleration vector using quaternion"""
        q0, q1, q2, q3 = quaternion
        ax, ay, az = accel
        
        # Rotation matrix from quaternion
        rot_matrix = np.array([
            [1 - 2*(q2**2 + q3**2), 2*(q1*q2 - q0*q3), 2*(q1*q3 + q0*q2)],
            [2*(q1*q2 + q0*q3), 1 - 2*(q1**2 + q3**2), 2*(q2*q3 - q0*q1)],
            [2*(q1*q3 - q0*q2), 2*(q2*q3 + q0*q1), 1 - 2*(q1**2 + q2**2)]
        ])
        
        return rot_matrix @ np.array([ax, ay, az])

    def update_kinematics(self, global_accel, dt):
        """Integrate acceleration to update velocity and position"""
        self.velocity += global_accel * dt
        self.position += self.velocity * dt
        
    def apply_zupt(self):
        """Zero Velocity Update during stance phase"""
        self.velocity = np.zeros(3)
        self.last_zupt = datetime.now().timestamp()

    def process(self, data):
        try:
            # Extract sensor data
            sensor = data['sensor_data']
            current_time = datetime.now().timestamp()
            
            # Get quaternion and convert to pitch
            q = (sensor['q0'], sensor['q1'], sensor['q2'], sensor['q3'])
            pitch = self.quaternion_to_pitch(q)
            
            # Get sensor data
            gyro_z = sensor['gz']
            accel = (sensor['ax'], sensor['ay'], sensor['az'])
            
            # Update buffers
            self.gyro_buffer.append(gyro_z)
            self.pitch_buffer.append(pitch)
            self.accel_buffer.append(accel)
            
            # Calculate filtered values
            filtered_gyro = np.mean(self.gyro_buffer)
            filtered_pitch = np.mean(self.pitch_buffer)
            filtered_accel = np.mean(self.accel_buffer, axis=0)
            
            # Rotate acceleration to global frame
            global_accel = self.rotate_acceleration(filtered_accel, q)
            
            # Detect gait events
            event = self.state_machine.update(
                fsr_data=sensor,
                gyro_z=filtered_gyro,
                pitch=filtered_pitch,
                current_time=current_time
            )
            
            # Process kinematics
            if self.accel_history:
                dt = current_time - self.timestamps[-1]
                self.update_kinematics(global_accel, dt)
                
            self.accel_history.append(global_accel)
            self.timestamps.append(current_time)
            
            # Apply ZUPT during stance phase
            if self.state_machine.state == "stance":
                if current_time - self.last_zupt > ZUPT_WINDOW:
                    self.apply_zupt()
                    self.stride_length = np.linalg.norm(self.position)
                    self.position = np.zeros(3)
            
            if event:
                print(f"{event.upper()} detected at {current_time}")
                print(f"Current stride length: {self.stride_length:.2f} meters")
                
            return event, self.stride_length
            
        except Exception as e:
            print(f"Processing error: {str(e)}")
            return None, 0.0

class GaitStateMachine:
    def __init__(self):
        self.state = "swing"
        self.last_event_time = 0
        self.debounce = 0.2  # 200ms debounce period

    def update(self, fsr_data, gyro_z, pitch, current_time):
        if current_time - self.last_event_time < self.debounce:
            return None

        event = None
        if self.state == "swing":
            if self.check_heel_strike(fsr_data, gyro_z, pitch):
                self.state = "stance"
                event = "heel_strike"
                self.last_event_time = current_time
        elif self.state == "stance":
            if self.check_toe_off(fsr_data, gyro_z, pitch):
                self.state = "swing"
                event = "toe_off"
                self.last_event_time = current_time
        return event

    def check_heel_strike(self, fsr, gyro_z, pitch):
        heel_force = sum(fsr[s] for s in HEEL_SENSORS) / len(HEEL_SENSORS)
        return (heel_force > HEEL_FORCE_THRESHOLD and 
                abs(gyro_z) < STATIONARY_GYRO_THRESHOLD and 
                abs(pitch) < FLAT_PITCH_THRESHOLD)

    def check_toe_off(self, fsr, gyro_z, pitch):
        toe_force = sum(fsr[s] for s in TOE_SENSORS) / len(TOE_SENSORS)
        return (toe_force < TOE_FORCE_THRESHOLD and 
                abs(gyro_z) > GYRO_MOVING_THRESHOLD and 
                pitch > PITCH_LIFT_THRESHOLD)

async def gait_analysis():
    processor = GaitProcessor()
    
    async with websockets.connect(WEBSOCKET_URI) as ws:
        print("Connected to gait analysis system")
        while True:
            try:
                message = await ws.recv()
                data = json.loads(message)
                
                if 'sensor_data' not in data:
                    continue
                
                event, stride = processor.process(data)
                
                # Optional: Send results back via WebSocket
                # await ws.send(json.dumps({
                #     "event": event,
                #     "stride_length": stride
                # }))
                
            except websockets.ConnectionClosed:
                print("Connection closed")
                break
            except Exception as e:
                print(f"Error: {str(e)}")
                continue

if __name__ == "__main__":
    asyncio.run(gait_analysis())