package com._yp.gaitMate.appointment.controller;

import com._yp.gaitMate.appointment.dto.AppointmentRequestDto;
import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import com._yp.gaitMate.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Slf4j
public class PatientAppointmentController {

    private final AppointmentService appointmentService;

    // ✅ 1. Request a new appointment
    @PostMapping("/request")
    @PreAuthorize("(hasRole('PATIENT'))")
    public ResponseEntity<AppointmentResponseDto> requestAppointment(
            @Valid @RequestBody AppointmentRequestDto requestDto) {

        AppointmentResponseDto response = appointmentService.requestAppointment(requestDto);
        return ResponseEntity.ok(response);
    }

    // ✅ 2. View my requested appointments
    @GetMapping("/my-requests")
    @PreAuthorize("(hasRole('PATIENT'))")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments() {
        List<AppointmentResponseDto> appointments = appointmentService.getAppointmentsForLoggedInPatient();
        return ResponseEntity.ok(appointments);
    }
}
