package com._yp.gaitMate.websocket.message;

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
public class ResultsNotificationMessage {
    private WebSocketMessageType type;      // results ready// sensorKit ID (same as device ID)
    private Boolean status;   // true/false for status updates
    private Long timestamp;

}


