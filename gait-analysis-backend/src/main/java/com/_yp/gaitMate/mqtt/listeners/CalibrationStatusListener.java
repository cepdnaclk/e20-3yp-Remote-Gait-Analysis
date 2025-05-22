package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.AbstractTopicListener;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import com._yp.gaitMate.websocket.NotificationMessage;
import com._yp.gaitMate.websocket.NotificationService;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.extern.slf4j.Slf4j;
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
 *   .
 *   .
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
            NotificationMessage message = ListenerUtil.extractAndValidateMessage(topic, payload, "cal_status");

            sensorKitService.setCalibrationStatus(message.getDeviceId(), message.getStatus());

            String username = sensorKitService.getUsernameBySensorKitId(message.getDeviceId());
            if (username == null) {
                log.warn("No user associated with device {}", message.getDeviceId());
                return;
            }

            notificationService.sendToUser(username, message);
            log.info("Calibration status update sent to user [{}] for device [{}]", username, message.getDeviceId());

        } catch (IllegalArgumentException e) {
            log.warn("Failed to handle calibration status message: {}", e.getMessage());
        }
    }
}
