package com._yp.gaitMate.mqtt.core;

import com.amazonaws.services.iot.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Publishes messages to AWS IoT Core using either blocking or non-blocking (async) mode.
 */

@Component
@RequiredArgsConstructor
@Slf4j
public class MqttPublisher {

    private final MqttClientProvider mqttClientProvider;

    /**
     * Publishes a message asynchronously using the given topic and QoS.
     * Success/failure will be handled by the IoTMessage callbacks.
     *
     * @param topic   the topic to publish to
     * @param payload the payload to send (typically JSON)
     * @param qos     the desired Quality of Service
     */
    public void publishAsync(String topic, String payload, AWSIotQos qos) {
        try {
            AWSIotMqttClient client = mqttClientProvider.getClient();

            log.info("📤 [ASYNC] Publishing to [{}] payload: {}", topic, payload);

            IoTMessage message = new IoTMessage(topic, qos, payload);
            client.publish(message, 3000); // timeout in ms
        } catch (AWSIotException e) {
            log.error("❌ [ASYNC] Failed to publish message: {}", e.getMessage(), e);
        }
    }

    /**
     * Publishes a message using blocking mode. Throws if the publishing fails.
     *
     * @param topic   the topic to publish to
     * @param payload the payload to send (typically JSON)
     * @param qos     the desired Quality of Service
     * @throws AWSIotException if publishing fails
     */
    public void publishBlocking(String topic, String payload, AWSIotQos qos) throws AWSIotException {
        AWSIotMqttClient client = mqttClientProvider.getClient();

        log.info("📤 [BLOCKING] Publishing to [{}] payload: {}", topic, payload);

        client.publish(topic, qos, payload); // blocking call
        log.info("✅ Published to [{}] successfully", topic);
    }
}
