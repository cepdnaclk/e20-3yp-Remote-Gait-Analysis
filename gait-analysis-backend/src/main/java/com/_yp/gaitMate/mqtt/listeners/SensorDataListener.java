package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.AbstractTopicListener;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import com._yp.gaitMate.websocket.message.DeviceAliveWebSocketMessage;
import com._yp.gaitMate.websocket.NotificationService;
import com._yp.gaitMate.websocket.message.SensorDataWebSocketMessage;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Listener for alive signal messages published by ESP32 devices.
 *
 * <p>This listens to the MQTT topic pattern:</p>
 * <pre>
 * device/{DEVICE_ID}/status/alive
 * </pre>
 *
 * <p>Expected JSON payload format:</p>
 * <pre>
 * {
 *   "type": "device_alive",
 *   "device_id": 34,
 *   "status": true
 * }
 * </pre>
 *
 * <p>Responsibilities:</p>
 * <ul>
 *   <li>Parse the device ID from the MQTT topic</li>
 *   <li>Validate and process the incoming JSON payload</li>
 *   <li>Notify the frontend user via WebSocket with the alive status</li>
 * </ul>
 */

//{
//    "type": "device_alive",
//    "device_id": 34,
//    "status": true
//}
@Profile("!test")
@Component
@Slf4j
public class SensorDataListener extends AbstractTopicListener {

    private final SensorKitService sensorKitService;
    private final NotificationService notificationService;

    public SensorDataListener(SensorKitService sensorKitService, NotificationService notificationService) {
        super("device/+/sensor_data", AWSIotQos.QOS1);
        this.sensorKitService = sensorKitService;
        this.notificationService = notificationService;
    }

    @Override
    public void handleMessage(String topic, String payload) {
        try {
            SensorDataWebSocketMessage message = ListenerUtil.extractSensorData(topic, payload);

            String username = sensorKitService.getUsernameBySensorKitId(message.getDeviceId());
            if (username == null) {
                log.warn("No user associated with device {}", message.getDeviceId());
                return;
            }

            notificationService.sendSensorDataToUser(username, message);
            log.info("sensor data forwarded to user [{}] for device [{}]", username, message.getDeviceId());

        } catch (IllegalArgumentException e) {
            log.warn("Failed to handle sensor data: {}", e.getMessage());
        }
    }
}
