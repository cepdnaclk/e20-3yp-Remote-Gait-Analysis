package com._yp.gaitMate.websocket;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NotificationBaseMessage {
    private String type;      // e.g., "cal_status", "orientation_captured"
    private Long deviceId;    // sensorKit ID (same as device ID)
    private Boolean status;   // true/false for status updates
    private String timestamp;

    public enum Type {
        CAL_STATUS,
        ORIENTATION_CAPTURED,
        DEVICE_ALIVE,
        RESULTS_READY
    }


}
