package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.AbstractTopicListener;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * Listens for calibration status updates on the topic: sensors/+/calibrationStatus
 *
 * Example topic: sensors/5/calibrationStatus
 * Example payload: { "status": true }
 *
 * This listener parses the sensor ID from the topic and updates the calibration status
 * of the corresponding SensorKit in the database.
 */
@Component
@Slf4j
public class CalibrationStatusListener extends AbstractTopicListener {

    private final SensorKitService sensorKitService;

    /**
     * Constructs the listener with the topic pattern and QoS.
     */
    public CalibrationStatusListener(SensorKitService sensorKitService) {
        super("sensors/+/calibrationStatus", AWSIotQos.QOS1);
        this.sensorKitService = sensorKitService;
    }

    /**
     * Handles incoming calibration status messages.
     * <p>
     * This method extracts the sensor ID from the MQTT topic and updates the
     * corresponding SensorKit's calibration status in the database based on the JSON payload.
     * </p>
     *
     * <p>Expected topic format:</p>
     * <pre>
     * sensors/{sensorId}/calibrationStatus
     * </pre>
     *
     * <p>Expected payload format:</p>
     * <pre>
     * {
     *   "status": true
     * }
     * </pre>
     *
     * @param topic   the MQTT topic the message was received on (e.g., "sensors/42/calibrationStatus")
     * @param payload the raw JSON payload of the message (e.g., "{ \"status\": true }")
     * @throws Exception if topic format is invalid or payload is malformed
     */
    @Override
    public void handleMessage(String topic, String payload) throws Exception {
        // Extract sensor ID from topic
        String[] parts = topic.split("/");

        // sensors/{sensorId}/calibrationStatus
        if (parts.length < 3) {
            log.warn("Invalid topic structure: {}", topic);
            return;
        }

        Long sensorId = Long.parseLong(parts[1]);

        // Parse JSON payload
        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree(payload);

        if (json.has("status")) {
            boolean isCalibrated = json.get("status").asBoolean();
            sensorKitService.setCalibrationStatus(sensorId, isCalibrated);
            log.info("✅ Calibration status for SensorKit {} set to {}", sensorId, isCalibrated);
        } else {
            log.warn("Payload missing 'status' field: {}", payload);
        }
    }
}
