package com._yp.gaitMate.dto.command;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO representing a command request from the frontend to be sent via MQTT.
 */
@Getter
@Setter
public class CommandRequestDto {

    @NotBlank(message = "Command must not be blank")
    private String command;

    public enum CommandType {
        CHECK_CALIBRATION,
        START_CALIBRATION,
        CAPTURE_ORIENTATION,
        START_STREAMING,
        STOP_STREAMING,
    }
}
