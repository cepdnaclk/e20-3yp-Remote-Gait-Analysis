package com._yp.gaitMate.appointment.dto;

import com._yp.gaitMate.model.enums.AppointmentType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequestDto {

    @NotNull
    private Long doctorId;

    @NotNull
    @Future(message = "Appointment time must be in the future")
    private LocalDateTime requestedTime;

    private String reason;

    private AppointmentType appointmentType = AppointmentType.FOLLOW_UP; // default 30 min
}
