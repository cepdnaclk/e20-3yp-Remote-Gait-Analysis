package com._yp.gaitMate.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RescheduleRequestDto {

    @NotNull
    @Future(message = "New time must be in the future")
    private LocalDateTime newTime;
}
