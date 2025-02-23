#include <Wire.h>
#include <Arduino.h>
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"



#define UART_BAUD_RATE 115200

MPU6050 mpu;
bool dmpReady = false;
uint8_t devStatus;
uint16_t packetSize;
uint8_t fifoBuffer[64];
float ypr[3];
Quaternion q;
VectorInt16 aa;      // Raw acceleration
VectorInt16 aaReal;  // Linear acceleration (gravity-free)
VectorFloat gravity; // Gravity vector

const int fsrPins[2] = {34, 32};  // Analog sensor pins
unsigned long syncedTime = 0;
unsigned long lastSyncTime = 0;


void setup() {
    Serial.begin(UART_BAUD_RATE);
    Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, 16, 17); // UART TX=17, RX=16
    Wire.begin();

    Serial.println("Initializing MPU6050...");
    mpu.initialize();
    devStatus = mpu.dmpInitialize();

    if (devStatus == 0) {
        Serial.println("Running calibration...");

        // Run calibration every time
        mpu.CalibrateAccel(6);
        mpu.CalibrateGyro(6);

        // Get new offsets
        int16_t xGyroOffset = mpu.getXGyroOffset();
        int16_t yGyroOffset = mpu.getYGyroOffset();
        int16_t zGyroOffset = mpu.getZGyroOffset();
        int16_t zAccelOffset = mpu.getZAccelOffset();

        Serial.printf("Calibrated Offsets -> XGyro: %d, YGyro: %d, ZGyro: %d, ZAccel: %d\n", 
                      xGyroOffset, yGyroOffset, zGyroOffset, zAccelOffset);

        // Apply calibration offsets directly
        mpu.setXGyroOffset(xGyroOffset);
        mpu.setYGyroOffset(yGyroOffset);
        mpu.setZGyroOffset(zGyroOffset);
        mpu.setZAccelOffset(zAccelOffset);

        // Enable DMP
        mpu.setDMPEnabled(true);
        dmpReady = true;
        packetSize = mpu.dmpGetFIFOPacketSize();
    } else {
        Serial.println("MPU6050 DMP Initialization Failed!");
    }

    Serial.println("ESP32 Sensor Node Ready!");
}




int readFSR(int pin) {
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += analogRead(pin);
        delay(10);
    }
    return sum / 5;
}

void loop() {
    if (Serial2.available()) {
        Serial.println("Data Available on Serial2... Reading...");
        
        String command = "";
        while (Serial2.available()) {
            char receivedChar = Serial2.read();
            command += receivedChar;
            delay(1);
        }

        command.trim();
        Serial.print("Received Command: ");
        Serial.println(command);

        if (command == "PING") {
            Serial.println("Received PING, sending ACK...");
            Serial2.println("ACK");
            return;
        }

        if (command.startsWith("SYNC_TIME:")) {
            int index = command.indexOf(":") + 1;
            if (index > 0) {
                String timeStr = command.substring(index);
                timeStr.trim();
                syncedTime = timeStr.toInt();
                lastSyncTime = millis();
                Serial.printf("Time Synced: %lu\n", syncedTime);
            } else {
                Serial.println("Invalid SYNC_TIME message received!");
            }
            return;
        }

        if (command == "REQ_DATA") {
            Serial.println("Received REQ_DATA, sending sensor readings...");
            unsigned long currentTime = syncedTime + (millis() - lastSyncTime) / 1000;

            int fsr1 = readFSR(fsrPins[0]);
            int fsr2 = readFSR(fsrPins[1]);
            
            // Set static FSR values for unconnected sensors
            int fsr3 = 0, fsr4 = 0, fsr5 = 0, fsr6 = 0, fsr7 = 0, fsr8 = 0;
            int fsr9 = 0, fsr10 = 0, fsr11 = 0, fsr12 = 0, fsr13 = 0, fsr14 = 0, fsr15 = 0, fsr16 = 0;

            if (dmpReady && mpu.dmpGetCurrentFIFOPacket(fifoBuffer)) {
                mpu.dmpGetQuaternion(&q, fifoBuffer);
                mpu.dmpGetGravity(&gravity, &q);
                mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
                mpu.dmpGetAccel(&aa, fifoBuffer);
                mpu.dmpGetLinearAccel(&aaReal, &aa, &gravity); // Get gravity-free acceleration
            }

            String sensorData = "{ \"timestamp\": " + String(currentTime) + 
                                ", \"FSR_1\": " + String(fsr1) +
                                ", \"FSR_2\": " + String(fsr2) +
                                ", \"FSR_3\": " + String(fsr3) +
                                ", \"FSR_4\": " + String(fsr4) +
                                ", \"yaw\": " + String(ypr[0] * 180 / M_PI) +
                                ", \"pitch\": " + String(ypr[1] * 180 / M_PI) +
                                ", \"roll\": " + String(ypr[2] * 180 / M_PI) +
                                ", \"q0\": " + String(q.w) +
                                ", \"q1\": " + String(q.x) +
                                ", \"q2\": " + String(q.y) +
                                ", \"q3\": " + String(q.z) +
                                ", \"ax\": " + String(aaReal.x) +
                                ", \"ay\": " + String(aaReal.y) +
                                ", \"az\": " + String(aaReal.z) +
                                ", \"gx\": " + String(gravity.x) +
                                ", \"gy\": " + String(gravity.y) +
                                ", \"gz\": " + String(gravity.z) + " }";

            Serial.println("Sending Sensor Data: " + sensorData);
            Serial2.println(sensorData);
        } else {
            Serial.println("Unrecognized command received!");
        }
    }
}
