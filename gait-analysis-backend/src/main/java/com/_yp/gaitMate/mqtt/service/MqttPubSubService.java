package com._yp.gaitMate.mqtt.service;

import com._yp.gaitMate.mqtt.utils.MqttUtil;
import com.amazonaws.services.iot.client.AWSIotException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttPubSubService {
    final private MqttUtil mqttUtil;

    public void connectToIoT() throws AWSIotException {
        mqttUtil.connectToIoT();
    }

    public void publishMessage(String topic, String command) throws AWSIotException {
//        TODO: handle not connected state
        String payload;

        switch (command){
            case "STOP":
                payload = "{\"action\": \"stop\"}";
                break;
            default:
                payload = "{\"error\": \"unknown command\"}";
        }

        mqttUtil.publishMessage(topic, payload);


    }

}
