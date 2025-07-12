package com._yp.gaitMate.appointment.mapper;

import com._yp.gaitMate.appointment.dto.AppointmentDetailResponse;
import com._yp.gaitMate.appointment.dto.AppointmentRequestDto;
import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import com._yp.gaitMate.model.Appointment;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.model.Patient;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public Appointment toEntity(AppointmentRequestDto dto, Doctor doctor, Patient patient) {
        return Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .startTime(dto.getRequestedTime())
                .appointmentType(dto.getAppointmentType())
                .reason(dto.getReason())
                .status(null) // Status will be set in service
                .createdBy(null) // Enum will be set in service
                .isRecurring(false) // All user requests are non-recurring
                .clinic(doctor.getClinic())
                .build();
    }

    public AppointmentResponseDto toResponseDto(Appointment appointment) {
        return AppointmentResponseDto.builder()
                .id(appointment.getId())
                .patientName(appointment.getPatient().getName())
                .doctorName(appointment.getDoctor().getName())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus())
                .appointmentType(appointment.getAppointmentType())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .isRecurring(appointment.getIsRecurring())
                .build();
    }

    public AppointmentDetailResponse toDetailResponse(Appointment appointment) {
        return AppointmentDetailResponse.builder()
                .id(appointment.getId())
                .patientName(appointment.getPatient().getName())
                .email(appointment.getPatient().getEmail())
                .startTime(appointment.getStartTime().toString())
                .durationMinutes(appointment.getDurationMinutes())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .createdBy(appointment.getCreatedBy())
                .clinicName(appointment.getClinic().getName())
                .build();
    }
}
