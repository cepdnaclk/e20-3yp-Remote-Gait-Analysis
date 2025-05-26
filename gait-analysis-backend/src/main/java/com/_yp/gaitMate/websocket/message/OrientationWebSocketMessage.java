package com._yp.gaitMate.websocket.message;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OrientationWebSocketMessage {
    private WebSocketMessageType type;        // Always "orientation"
    private Long deviceId;
    private Long timestamp;
    private boolean status;     // true = orientation captured
}
