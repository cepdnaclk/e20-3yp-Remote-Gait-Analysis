package com._yp.gaitMate.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Sends WebSocket messages to authenticated users.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Sends a message to the frontend user via WebSocket.
     *
     * @param username Spring Security username of the logged-in user
     * @param message  the message payload to send
     */
    public void sendToUser(String username, NotificationMessage message) {
        String destination = "/topic";
        log.info("📡 Sending WebSocket message to user [{}]: {}", username, message);
        messagingTemplate.convertAndSendToUser(username, destination, message);
    }

    public void broadcastCalibration(String username , CalibrationStatusWebSocketMessage message) {
        String destination = "/topic/cal_status";
        messagingTemplate.convertAndSendToUser(username, destination, message);
    }

}
