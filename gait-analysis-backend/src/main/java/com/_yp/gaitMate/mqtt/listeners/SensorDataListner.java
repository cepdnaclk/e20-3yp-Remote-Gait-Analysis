package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.AbstractTopicListener;
import com._yp.gaitMate.websocket.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SensorDataListner extends AbstractTopicListener {

    private final NotificationService notificationService;

    @Override
    public void handleMessage(String topic, String payload) throws Exception {
        try {
            String deviceId = ListenerUtil.extractDeviceId(topic);
            SensorDataMessage data = objectMapper.readValue(payload, SensorDataMessage.class);

            log.info("Received sensor data from {}: {}", deviceId, data);

            // Send over WebSocket to the user associated with this device
            notificationService.sendSensorDataToUser(deviceId, data);

        } catch (Exception e) {
            log.error("Failed to process sensor data message", e);
        }
    }
}
