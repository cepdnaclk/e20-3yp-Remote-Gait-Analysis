package com._yp.gaitMate.appointment.controller;

import com._yp.gaitMate.appointment.dto.AppointmentDetailResponse;
import com._yp.gaitMate.appointment.mapper.AppointmentMapper;
import com._yp.gaitMate.appointment.service.AppointmentService;
import com._yp.gaitMate.model.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentMapper appointmentMapper;

    @GetMapping("/appointments/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
    public ResponseEntity<AppointmentDetailResponse> getAppointmentDetail(@PathVariable Long id) {

        Appointment appointment = appointmentService.findByIdForDoctorOrPatient(id);
        AppointmentDetailResponse dto =  appointmentMapper.toDetailResponse(appointment);

        return ResponseEntity.ok(dto);
    }
}
