package com._yp.gaitMate.mqtt.listeners;

import com._yp.gaitMate.mqtt.core.MqttClientProvider;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.AWSIotException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Registers MQTT topic listeners at application startup.
 * <p>
 * This class ensures that all defined MQTT topic listeners are subscribed
 * to AWS IoT Core once the client is connected.
 * </p>
 */
@Profile("!test")
@Component
@RequiredArgsConstructor
@Slf4j
public class MqttSubscriptionRegistrar {

    private final MqttClientProvider mqttClientProvider;
    private final CalibrationStatusListener calibrationStatusListener;
    private final OrientationStatusListener orientationStatusListener;
    private final AliveSignalListener aliveSignalListener;
    private final SensorDataListener sensorDataListener;
    /**
     * Called automatically after Spring context is initialized.
     * Subscribes the application to all required MQTT topics.
     */
    @PostConstruct
    public void subscribeToTopics() {
        try {
            AWSIotMqttClient client = mqttClientProvider.getClient();

            // Subscribe to calibration status topic
            client.subscribe(calibrationStatusListener, true);
            client.subscribe(orientationStatusListener, true);
            client.subscribe(aliveSignalListener, true);
            client.subscribe(sensorDataListener, true);
            log.info("✅ Subscribed to topic: {}", calibrationStatusListener.getTopic());
            log.info("✅ Subscribed to topic: {}", orientationStatusListener.getTopic());
            log.info("✅ Subscribed to topic: {}", aliveSignalListener.getTopic());
            log.info("✅ Subscribed to topic: {}", sensorDataListener.getTopic());

        } catch (AWSIotException e) {
            log.error("❌ Failed to subscribe to MQTT topics: {}", e.getMessage(), e);
        }
    }
}
