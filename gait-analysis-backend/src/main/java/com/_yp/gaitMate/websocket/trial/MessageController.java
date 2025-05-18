package com._yp.gaitMate.websocket.trial;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageController {
    // Helper used in controller to send messages from server
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat")
    public void chat(@Payload Message message) {
        log.info("Message received: {}", message);
        // convertAndSendToUser - Backend method to send message to a specific authenticated user
        simpMessagingTemplate.convertAndSendToUser(message.getTo(), "/topic", message);
        // client is subscribed to "/user/topic"
        // will be rewritten to "/user/{doctor_session}/topic"
    }

}
