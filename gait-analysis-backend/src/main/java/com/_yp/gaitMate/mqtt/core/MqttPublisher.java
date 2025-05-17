package com._yp.gaitMate.mqtt.core;

import com.amazonaws.services.iot.client.AWSIotException;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Handles publishing messages to AWS IoT Core via MQTT.
 * This service can be reused for sending commands, alerts, or updates to IoT devices.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MqttPublisher {

    private final MqttClientProvider mqttClientProvider;

    /**
     * Publishes a message to the given topic with QOS1.
     *
     * @param topic   the topic to publish to
     * @param payload the JSON payload
     */
    public void publish(String topic, String payload) {
        try {
            AWSIotMqttClient client = mqttClientProvider.getClient();

            log.info("📤 Publishing to [{}] payload: {}", topic, payload);

            IoTMessage message = new IoTMessage(topic, AWSIotQos.QOS1, payload);

            client.publish(message, 3000);

        } catch (AWSIotException e) {
            log.error("❌ Failed to publish message: {}", e.getMessage(), e);
        }
    }
}
