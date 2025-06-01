package com._yp.gaitMate.mqtt.core;

import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.AWSIotException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class MqttClientProvider {

    @Value("${mqtt.client.endpoint}")
    private String clientEndpoint;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.aws.access.id}")
    private String awsAccessKeyId;

    @Value("${mqtt.aws.access.key}")
    private String awsSecretAccessKey;

    private AWSIotMqttClient client;

    public synchronized AWSIotMqttClient getClient() throws AWSIotException {
        if (client == null) {
            String randomSuffix = UUID.randomUUID().toString().substring(0, 8);

            clientId = "springBootApp-" + randomSuffix;

            log.info("Initializing AWS IoT MQTT Client");
            client = new AWSIotMqttClient(clientEndpoint, clientId, awsAccessKeyId, awsSecretAccessKey);
            client.connect();
            log.info("Connected to AWS IoT Core");
        }

        return client;
    }
}
