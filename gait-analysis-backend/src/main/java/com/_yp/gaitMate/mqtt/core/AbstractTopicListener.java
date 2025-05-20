package com._yp.gaitMate.mqtt.core;

import com.amazonaws.services.iot.client.AWSIotMessage;
import com.amazonaws.services.iot.client.AWSIotQos;
import com.amazonaws.services.iot.client.AWSIotTopic;
import lombok.extern.slf4j.Slf4j;

/**
 * An abstract base class for handling incoming MQTT messages on specific topics.
 * <p>
 * This class extends {@link AWSIotTopic} and provides centralized logging and
 * error handling. Subclasses must implement the {@link #handleMessage(String, String)}
 * method to define custom behavior for specific topic payloads.
 * </p>
 *
 * <p>Example usage:</p>
 * <pre>
 * {@code
 * public class CalibrationStatusListener extends AbstractTopicListener {
 *     public CalibrationStatusListener() {
 *         super("sensors/+/calibrationStatus", AWSIotQos.QOS1);
 *     }
 *
 *     @Override
 *     public void handleMessage(String topic, String payload) {
 *         // Custom handling
 *     }
 * }
 * }
 * </pre>
 */
@Slf4j
public abstract class AbstractTopicListener extends AWSIotTopic {

    /**
     * Constructs a topic listener for the given topic and QoS level.
     *
     * @param topic the topic filter to subscribe to (can include wildcards)
     * @param qos   the Quality of Service level for the subscription
     */
    public AbstractTopicListener(String topic, AWSIotQos qos) {
        super(topic, qos);
    }

    /**
     * This method is automatically called by the AWS IoT client
     * when a message is received for this topic.
     * It delegates to {@link #handleMessage(String, String)} after logging and error checking.
     *
     * @param message the received AWS IoT message
     */
    @Override
    public void onMessage(AWSIotMessage message) {
        try {
            String topic = message.getTopic();
            String payload = message.getStringPayload();
            log.info("📩 Received [{}]: {}", topic, payload);

            handleMessage(topic, payload);
        } catch (Exception e) {
            log.error("❌ Error while handling MQTT message: {}", e.getMessage(), e);
        }
    }

    /**
     * Implement this method to define how to process the received MQTT message.
     *
     * @param topic   the topic the message was received on
     * @param payload the raw payload of the message (usually JSON)
     * @throws Exception if any error occurs while processing the message
     */
    public abstract void handleMessage(String topic, String payload) throws Exception;
}
