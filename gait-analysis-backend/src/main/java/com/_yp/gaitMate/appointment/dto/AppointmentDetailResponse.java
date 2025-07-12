package com._yp.gaitMate.appointment.dto;

import com._yp.gaitMate.model.enums.AppointmentCreatedBy;
import com._yp.gaitMate.model.enums.AppointmentStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDetailResponse {
    private Long id;
    private String patientName;
    private String email;
    private String startTime;
    private Integer durationMinutes;
    private String reason;
    private AppointmentStatus status;
    private String notes;
    private AppointmentCreatedBy createdBy;
    private String clinicName;
}
