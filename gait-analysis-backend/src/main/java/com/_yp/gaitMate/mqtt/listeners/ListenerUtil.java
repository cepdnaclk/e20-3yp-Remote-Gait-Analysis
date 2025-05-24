package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.websocket.message.CalibrationStatusWebSocketMessage;
import com._yp.gaitMate.websocket.message.NotificationMessage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
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

    /**
     * Extracts and validates calibration payload and builds WebSocket message.
     */
    public static CalibrationStatusWebSocketMessage extractAndValidateCalibrationMessage(String topic, String payload) {
        String[] parts = topic.split("/");
        if (parts.length < 4 || !"device".equals(parts[0])) {
            throw new IllegalArgumentException("Invalid topic format: " + topic);
        }

        Long deviceId;
        try {
            deviceId = Long.parseLong(parts[1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid numeric device ID in topic: " + topic);
        }

        JsonNode json;
        try {
            ObjectMapper mapper = new ObjectMapper();
            json = mapper.readTree(payload);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON payload");
        }

        if (!json.has("type") || !json.has("status")) {
            throw new IllegalArgumentException("Payload missing required fields");
        }

        String type = json.get("type").asText();
        if (!"cal_status".equals(type)) {
            throw new IllegalArgumentException("Unexpected type: " + type);
        }

        return CalibrationStatusWebSocketMessage.builder()
                .type("cal_status")
                .deviceId(deviceId)
                .timestamp(json.has("timestamp") ? json.get("timestamp").asLong() : Instant.now().getEpochSecond())
                .sys(json.has("sys") ? json.get("sys").asInt() : 0)
                .gyro(json.has("gyro") ? json.get("gyro").asInt() : 0)
                .accel(json.has("accel") ? json.get("accel").asInt() : 0)
                .mag(json.has("mag") ? json.get("mag").asInt() : 0)
                .status(json.get("status").asBoolean())
                .build();
    }


}
