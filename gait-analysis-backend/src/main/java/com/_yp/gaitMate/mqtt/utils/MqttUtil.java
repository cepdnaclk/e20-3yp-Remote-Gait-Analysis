package com._yp.gaitMate.mqtt.utils;

import com._yp.gaitMate.mqtt.MyMessage;
import com.amazonaws.services.iot.client.AWSIotException;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.AWSIotQos;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

@Service
public class MqttUtil {
    @Value("${mqtt.client.endpoint}")
    String clientEndpoint;   // use value returned by describe-endpoint --endpoint-type "iot:Data-ATS"

    @Value("${mqtt.client.id}")
    String clientId;                              // replace with your own client ID. Use unique client IDs for concurrent connections.

    @Value("${mqtt.aws.access.id}")
    String awsAccessKeyId;

    @Value("${mqtt.aws.access.key}")
    String awsSecretAccessKey;


    String sessionToken = null;

    AWSIotMqttClient client;

    public void connectToIoT() throws AWSIotException {
        // AWS IAM credentials could be retrieved from AWS Cognito, STS, or other secure sources
        client = new AWSIotMqttClient(clientEndpoint, clientId, awsAccessKeyId, awsSecretAccessKey, sessionToken);

        // optional parameters can be set before connect()
        client.connect();

        System.out.println("Connected to IoT");
    }



    public void publishMessage(String topic, String payload) throws AWSIotException {
        long timeout = 3000;                    // milliseconds
        AWSIotQos qos = AWSIotQos.QOS0;

        MyMessage message = new MyMessage(topic, qos, payload);
        client.publish(message, timeout);
    }
}
