package com._yp.gaitMate.service.commandService;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.command.CommandRequestDto;

public interface CommandService {
    public ApiResponse sendCommandToSensor(CommandRequestDto request);
}
