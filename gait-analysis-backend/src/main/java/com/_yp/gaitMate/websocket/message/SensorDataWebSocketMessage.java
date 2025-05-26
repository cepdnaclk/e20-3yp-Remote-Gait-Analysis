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
    private Long deviceId;
    private Long timestamp;

    // FSR values
    private int FSR_1;
    private int FSR_2;
    private int FSR_3;
    private int FSR_4;
    private int FSR_5;
    private int FSR_6;
    private int FSR_7;
    private int FSR_8;
    private int FSR_9;
    private int FSR_10;
    private int FSR_11;
    private int FSR_12;
    private int FSR_13;
    private int FSR_14;
    private int FSR_15;
    private int FSR_16;

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
