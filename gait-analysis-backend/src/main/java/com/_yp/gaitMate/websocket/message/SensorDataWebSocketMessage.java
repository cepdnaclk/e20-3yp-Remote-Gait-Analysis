package com._yp.gaitMate.websocket.message;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SensorDataWebSocketMessage {

    private WebSocketMessageType type;   // Always SENSOR_DATA
    private String deviceId;
    private long timestamp;

    // FSR values
    private int FSR_1;
    private int FSR_2;

    // Orientation (Euler)
    private float yaw;
    private float pitch;
    private float roll;

    // Quaternion
    private float q0;
    private float q1;
    private float q2;
    private float q3;

    // Acceleration (m/s²)
    private float ax;
    private float ay;
    private float az;

    // Gyroscope (deg/s)
    private float gx;
    private float gy;
    private float gz;

    // BNO055 Calibration Statuses (0-3)
    private int sysCal;
    private int gyroCal;
    private int accelCal;
    private int magCal;
}
