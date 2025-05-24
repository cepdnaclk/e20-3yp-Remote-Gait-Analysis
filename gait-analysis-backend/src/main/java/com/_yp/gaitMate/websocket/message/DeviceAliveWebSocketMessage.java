package com._yp.gaitMate.websocket.message;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DeviceAliveWebSocketMessage {
    private WebSocketMessageType type;        // Always "device_alive"
    private Long deviceId;
    private Long timestamp;
    private boolean status;     // true = deivce connected
}
