package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.AbstractTopicListener;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import com._yp.gaitMate.websocket.message.CalibrationStatusWebSocketMessage;
import com._yp.gaitMate.websocket.NotificationService;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Listener for calibration status updates published by ESP32 devices.
 *
 * <p>This listens to the MQTT topic pattern:</p>
 * <pre>
 * device/{DEVICE_ID}/status/calibration
 * </pre>
 *
 * <p>Expected JSON payload format:</p>
 * <pre>
 * {
 *   "type": "cal_status",
 *   "device_id": 34,
 *   "status": true,
 *   "timestamp": 1321044433,
 *   "sys": 3,
 *   "gyro": 3,
 *   "accel": 3,
 *   "mag": 3
 * }
 * </pre>
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Parse device ID from the topic</li>
 *   <li>Validate and process the JSON payload</li>
 *   <li>Update SensorKit calibration status in the database</li>
 *   <li>Send WebSocket message to the linked frontend user</li>
 * </ul>
 */

//{
//    "type": "cal_status",
//    "device_id": 34,
//    "status": true
//}

@Component
@Slf4j
public class CalibrationStatusListener extends AbstractTopicListener {

    private final SensorKitService sensorKitService;
    private final NotificationService notificationService;

    public CalibrationStatusListener(SensorKitService sensorKitService, NotificationService notificationService) {
        super("device/+/status/calibration", AWSIotQos.QOS1);
        this.sensorKitService = sensorKitService;
        this.notificationService = notificationService;
    }

    @Override
    public void handleMessage(String topic, String payload) {
        try {
            // Parse MQTT payload into DTO
            CalibrationStatusWebSocketMessage calMsg = ListenerUtil.extractCalibrationStatus(topic, payload);

            // Only update DB if calibrated
            if (calMsg.isStatus()) {
                sensorKitService.setCalibrationStatus(calMsg.getDeviceId(), true);
            }

            // Get username linked to the device
            String username = sensorKitService.getUsernameBySensorKitId(calMsg.getDeviceId());
            if (username == null) {
                log.warn("No user associated with device {}", calMsg.getDeviceId());
                return;
            }


            // Broadcast to WebSocket subscribers
            notificationService.sendCalibrationStatusToUser(username,calMsg);
            log.info("📡 Sent calibration update to /topic/status/calibration for device [{}]", calMsg.getDeviceId());

        } catch (IllegalArgumentException e) {
            log.warn("❌ Failed to parse calibration status message: {}", e.getMessage());
        }
    }
}
