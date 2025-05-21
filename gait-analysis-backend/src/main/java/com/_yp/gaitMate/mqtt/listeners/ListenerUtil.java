package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.websocket.NotificationMessage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

public class ListenerUtil {

    /**
     * Extracts and validates an incoming MQTT message payload and topic.
     *
     * @param topic        the full MQTT topic (e.g., "device/5/status/calibration")
     * @param payload      the JSON payload
     * @param expectedType the expected type field in the payload (e.g., "cal_status", "alive")
     * @return a populated NotificationMessage
     * @throws IllegalArgumentException if the topic or payload is invalid
     */
    public static NotificationMessage extractAndValidateMessage(String topic, String payload, String expectedType) {
        // Validate topic structure: device/{deviceId}/status/{type}
        String[] parts = topic.split("/");
        if (parts.length < 4 || !"device".equals(parts[0])) {
            throw new IllegalArgumentException("Invalid topic format: " + topic);
        }

        long deviceId;
        try {
            deviceId = Long.parseLong(parts[1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid device ID in topic: " + topic);
        }

        // Parse JSON
        JsonNode json;
        try {
            ObjectMapper mapper = new ObjectMapper();
            json = mapper.readTree(payload);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON payload");
        }

        // Validate payload structure
        if (!json.has("type") || !json.has("status")) {
            throw new IllegalArgumentException("Payload missing required fields");
        }

        String type = json.get("type").asText();
        if (!expectedType.equals(type)) {
            throw new IllegalArgumentException("Unexpected type: " + type);
        }

        boolean status = json.get("status").asBoolean();

        return NotificationMessage.builder()
                .type(type)
                .deviceId(deviceId)
                .status(status)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }
}
