package com._yp.gaitMate.appointment.dto;

import com._yp.gaitMate.model.enums.AppointmentStatus;
import com._yp.gaitMate.model.enums.AppointmentType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentResponseDto {

    private Long id;

    private String patientName;

    private String doctorName;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private AppointmentStatus status;

    private AppointmentType appointmentType;

    private String reason;

    private String notes;

    private boolean isRecurring;
}
