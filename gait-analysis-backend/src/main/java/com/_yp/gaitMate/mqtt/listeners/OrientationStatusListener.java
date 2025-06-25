package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.AbstractTopicListener;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import com._yp.gaitMate.websocket.NotificationService;
import com._yp.gaitMate.websocket.message.OrientationWebSocketMessage;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Listener for orientation capture status updates published by ESP32 devices.
 *
 * <p>This listens to the MQTT topic pattern:</p>
 * <pre>
 * device/{DEVICE_ID}/status/orientation
 * </pre>
 *
 * <p>Expected JSON payload format:</p>
 * <pre>
 * {
 *   "type": "orientation_captured",
 *   "device_id": 34,
 *   "status": true,
 *   "timestamp": 1321044433
 * }
 * </pre>
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Parse device ID from the topic</li>
 *   <li>Validate and process the JSON payload</li>
 *   <li>Send WebSocket message to the linked frontend user</li>
 * </ul>
 */
//{
//        "type": "orientation_captured",
//        "device_id": 34,
//        "status": true
//        }
@Component
@Slf4j
public class OrientationStatusListener extends AbstractTopicListener {

    private final SensorKitService sensorKitService;
    private final NotificationService notificationService;

    public OrientationStatusListener(SensorKitService sensorKitService, NotificationService notificationService) {
        super("device/+/status/orientation", AWSIotQos.QOS1);
        this.sensorKitService = sensorKitService;
        this.notificationService = notificationService;
    }

    @Override
    public void handleMessage(String topic, String payload) throws Exception {
        try {
            OrientationWebSocketMessage message = ListenerUtil.extractOrientationStatus(topic, payload);

            String username = sensorKitService.getUsernameBySensorKitId(message.getDeviceId());
            if (username == null) {
                log.warn("No user associated with device {}", message.getDeviceId());
                return;
            }

            notificationService.sendOrientationStatusToUser(username, message);
            log.info("Orientation update sent to user [{}] for device [{}]", username, message.getDeviceId());

        } catch (IllegalArgumentException e) {
            log.warn("Failed to handle orientation status message: {}", e.getMessage());
        }
    }
}
