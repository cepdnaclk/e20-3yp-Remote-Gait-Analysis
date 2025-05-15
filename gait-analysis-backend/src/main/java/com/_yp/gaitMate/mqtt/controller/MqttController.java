package com._yp.gaitMate.mqtt.controller;

import com._yp.gaitMate.mqtt.service.MqttPubSubService;
import com.amazonaws.services.iot.client.AWSIotException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mqtt")
@RequiredArgsConstructor
public class MqttController {
    private final MqttPubSubService mqttPubSubService;

    @PostMapping("/connect")
    public String connectToIoT() throws AWSIotException {
        mqttPubSubService.connectToIoT();
        return "Connected successfully";
    }

    @PostMapping("/publish")
    public String publishMessage() throws AWSIotException {
        mqttPubSubService.publishMessage("sensors/5/command", "STOP");
        return "published successfully";
    }

}
