package com._yp.gaitMate.websocket;

import lombok.*;

/**
 * Represents a WebSocket notification message sent to the frontend.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NotificationMessage {
    private String type;      // e.g., "cal_status", "orientation_captured"
    private Long deviceId;    // sensorKit ID (same as device ID)
    private Boolean status;   // true/false for status updates
    private String extra;     // Optional: system info, timestamp, etc.
    // TODO: timestamp?
}
