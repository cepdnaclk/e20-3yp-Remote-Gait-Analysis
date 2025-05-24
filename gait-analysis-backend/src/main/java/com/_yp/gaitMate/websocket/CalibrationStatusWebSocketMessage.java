package com._yp.gaitMate.websocket;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CalibrationStatusWebSocketMessage {
    private String type;        // Always "CAL_STATUS"
    private Long deviceId;
    private Long timestamp;

    private int sys;
    private int gyro;
    private int accel;
    private int mag;

    private boolean status;     // true = fully calibrated
}
