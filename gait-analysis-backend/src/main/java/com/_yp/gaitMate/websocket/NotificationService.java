package com._yp.gaitMate.websocket;

import com._yp.gaitMate.websocket.message.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    private static final String TOPIC_ALIVE = "/topic/status/alive";
    private static final String TOPIC_CALIBRATION = "/topic/status/calibration";
    private static final String TOPIC_ORIENTATION = "/topic/status/orientation";
    private static final String TOPIC_SENSOR_DATA = "/topic/data/sensor";

    public void sendDeviceAliveToUser(String username, DeviceAliveWebSocketMessage message) {
        try {
            log.info("📡 Sending DEVICE_ALIVE to [{}]: {}", username, message);
            messagingTemplate.convertAndSendToUser(username, TOPIC_ALIVE, message);
        } catch (Exception e) {
            log.error("❌ Failed to send DEVICE_ALIVE to [{}]: {}", username, e.getMessage());
        }
    }

    public void sendCalibrationStatusToUser(String username, CalibrationStatusWebSocketMessage message) {
        try {
            log.info("📡 Sending CALIBRATION_STATUS to [{}]: {}", username, message);
            messagingTemplate.convertAndSendToUser(username, TOPIC_CALIBRATION, message);
        } catch (Exception e) {
            log.error("❌ Failed to send CALIBRATION_STATUS to [{}]: {}", username, e.getMessage());
        }
    }

    public void sendOrientationStatusToUser(String username, OrientationWebSocketMessage message) {
        try {
            log.info("📡 Sending ORIENTATION_CAPTURED to [{}]: {}", username, message);
            messagingTemplate.convertAndSendToUser(username, TOPIC_ORIENTATION, message);
        } catch (Exception e) {
            log.error("❌ Failed to send ORIENTATION_CAPTURED to [{}]: {}", username, e.getMessage());
        }
    }

    public void sendSensorDataToUser(String username, SensorDataWebSocketMessage message) {
        try {
            log.info("📡 Sending SENSOR_DATA to [{}]: {}", username, message);
            messagingTemplate.convertAndSendToUser(username, TOPIC_SENSOR_DATA, message);
        } catch (Exception e) {
            log.error("❌ Failed to send SENSOR_DATA to [{}]: {}", username, e.getMessage());
        }
    }
}
