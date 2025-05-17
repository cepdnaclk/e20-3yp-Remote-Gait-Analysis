package com._yp.gaitMate.mqtt.core;

import com.amazonaws.services.iot.client.AWSIotMessage;
import com.amazonaws.services.iot.client.AWSIotQos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IoTMessage extends AWSIotMessage {
    private static final Logger log = LoggerFactory.getLogger(IoTMessage.class);

    public IoTMessage(String topic, AWSIotQos qos, String payload) {
        super(topic, qos, payload);
    }

    @Override
    public void onSuccess() {
        // called when message publishing succeeded
        log.info("Message published successfully");
    }

    @Override
    public void onFailure() {
        // called when message publishing failed
        log.error("Message publishing failed");
    }

    @Override
    public void onTimeout() {
        // called when message publishing timed out
        log.error("Message publishing timed out");
    }
}