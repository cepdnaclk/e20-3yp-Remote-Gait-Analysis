package com._yp.gaitMate.mqtt;

import com._yp.gaitMate.mqtt.core.MqttClientProvider;
import com.amazonaws.services.iot.client.AWSIotMessage;
import com.amazonaws.services.iot.client.AWSIotQos;
import com.amazonaws.services.iot.client.AWSIotTopic;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.AWSIotException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class MqttStartupTestSubscriber {

    private final MqttClientProvider mqttClientProvider;

    /**
     * This class runs automatically after the app starts
     * @throws AWSIotException
     */
    @PostConstruct
    public void subscribeToTestTopic() throws AWSIotException {
        AWSIotMqttClient client = mqttClientProvider.getClient();

        String topic = "test/topic"; // change this to a topic you're testing with
        AWSIotQos qos = AWSIotQos.QOS1;

        AWSIotTopic listener = new AWSIotTopic(topic, qos) {
            @Override
            public void onMessage(AWSIotMessage message) {
                String payload = message.getStringPayload();
                log.info("✅ Received message on [{}]: {}", message.getTopic(), payload);
            }
        };

        client.subscribe(listener, true);
        log.info("✅ Subscribed to test topic: {}", topic);
    }
}
