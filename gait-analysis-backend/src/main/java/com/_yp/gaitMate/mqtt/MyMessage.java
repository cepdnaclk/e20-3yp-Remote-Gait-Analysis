package com._yp.gaitMate.mqtt;

import com.amazonaws.services.iot.client.AWSIotMessage;
import com.amazonaws.services.iot.client.AWSIotQos;

public class MyMessage extends AWSIotMessage {
    public MyMessage(String topic, AWSIotQos qos, String payload) {
        super(topic, qos, payload);
    }

    @Override
    public void onSuccess() {
        // called when message publishing succeeded
        System.out.println("Message published successfully");
    }

    @Override
    public void onFailure() {
        // called when message publishing failed
        System.out.println("Message publishing failed");
    }

    @Override
    public void onTimeout() {
        // called when message publishing timed out
        System.out.println("Message publishing timed out");
    }
}