package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.websocket.message.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;

@Profile("!test")
@Slf4j
public class ListenerUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Long parseDeviceIdFromTopic(String topic) {
        try {
            String[] parts = topic.split("/");
            return Long.parseLong(parts[1]);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid topic: " + topic);
        }
    }

    private static JsonNode parseJson(String payload, WebSocketMessageType expectedType) {
        try {
            JsonNode json = objectMapper.readTree(payload);
            String type = json.has("type") ? json.get("type").asText() : null;
            if (type == null || !expectedType.name().equalsIgnoreCase(type)) {
                throw new IllegalArgumentException("Unexpected or missing type in payload: " + type);
            }
            return json;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON payload: " + e.getMessage());
        }
    }

    public static CalibrationStatusWebSocketMessage extractCalibrationStatus(String topic, String payload) {
        Long deviceId = parseDeviceIdFromTopic(topic);
        JsonNode json = parseJson(payload, WebSocketMessageType.CAL_STATUS);

        return CalibrationStatusWebSocketMessage.builder()
                .type(WebSocketMessageType.CAL_STATUS)
                .deviceId(deviceId)
                .timestamp(json.get("timestamp").asLong())
                .sys(json.get("sys").asInt())
                .gyro(json.get("gyro").asInt())
                .accel(json.get("accel").asInt())
                .mag(json.get("mag").asInt())
                .status(json.get("status").asBoolean())
                .build();
    }

    public static DeviceAliveWebSocketMessage extractAliveStatus(String topic, String payload) {
        Long deviceId = parseDeviceIdFromTopic(topic);
        JsonNode json = parseJson(payload, WebSocketMessageType.DEVICE_ALIVE);

        return DeviceAliveWebSocketMessage.builder()
                .type(WebSocketMessageType.DEVICE_ALIVE)
                .deviceId(deviceId)
                .timestamp(json.get("timestamp").asLong())
                .status(json.get("status").asBoolean())
                .build();
    }

    public static OrientationWebSocketMessage extractOrientationStatus(String topic, String payload) {
        Long deviceId = parseDeviceIdFromTopic(topic);
        JsonNode json = parseJson(payload, WebSocketMessageType.ORIENTATION_CAPTURED);

        return OrientationWebSocketMessage.builder()
                .type(WebSocketMessageType.ORIENTATION_CAPTURED)
                .deviceId(deviceId)
                .timestamp(json.get("timestamp").asLong())
                .status(json.get("status").asBoolean())
                .build();
    }

    public static SensorDataWebSocketMessage extractSensorData(String topic, String payload) {
        Long deviceId = parseDeviceIdFromTopic(topic);
        JsonNode json = parseJson(payload, WebSocketMessageType.SENSOR_DATA);

        return SensorDataWebSocketMessage.builder()
                .type(WebSocketMessageType.SENSOR_DATA)
                .deviceId(deviceId)
                .timestamp(json.get("timestamp").asLong())
                .FSR_1(json.get("FSR_1").asInt())
                .FSR_2(json.get("FSR_2").asInt())
                .FSR_3(json.get("FSR_3").asInt())
                .FSR_4(json.get("FSR_4").asInt())
                .FSR_5(json.get("FSR_5").asInt())
                .FSR_6(json.get("FSR_6").asInt())
                .FSR_7(json.get("FSR_7").asInt())
                .FSR_8(json.get("FSR_8").asInt())
                .FSR_9(json.get("FSR_9").asInt())
                .FSR_10(json.get("FSR_10").asInt())
                .FSR_11(json.get("FSR_11").asInt())
                .FSR_12(json.get("FSR_12").asInt())
                .FSR_13(json.get("FSR_13").asInt())
                .FSR_14(json.get("FSR_14").asInt())
                .FSR_15(json.get("FSR_15").asInt())
                .FSR_16(json.get("FSR_16").asInt())
                .yaw((float) json.get("yaw").asDouble())
                .pitch((float) json.get("pitch").asDouble())
                .roll((float) json.get("roll").asDouble())
                .q0((float) json.get("q0").asDouble())
                .q1((float) json.get("q1").asDouble())
                .q2((float) json.get("q2").asDouble())
                .q3((float) json.get("q3").asDouble())
                .ax((float) json.get("ax").asDouble())
                .ay((float) json.get("ay").asDouble())
                .az((float) json.get("az").asDouble())
                .gx((float) json.get("gx").asDouble())
                .gy((float) json.get("gy").asDouble())
                .gz((float) json.get("gz").asDouble())
                .sysCal(json.get("sys_cal").asInt())
                .gyroCal(json.get("gyro_cal").asInt())
                .accelCal(json.get("accel_cal").asInt())
                .magCal(json.get("mag_cal").asInt())
                .build();
    }
}
