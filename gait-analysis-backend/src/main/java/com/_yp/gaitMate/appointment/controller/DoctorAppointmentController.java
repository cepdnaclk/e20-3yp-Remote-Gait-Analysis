package com._yp.gaitMate.appointment.controller;

import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import com._yp.gaitMate.appointment.dto.NoteRequestDto;
import com._yp.gaitMate.appointment.dto.RescheduleRequestDto;
import com._yp.gaitMate.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/appointments")
@RequiredArgsConstructor
public class DoctorAppointmentController {

    private final AppointmentService appointmentService;

    // ✅ View Pending Appointments
    @GetMapping("/pending")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponseDto>> getPendingAppointments() {
        return ResponseEntity.ok(appointmentService.getDoctorAppointmentsByStatus("PENDING"));
    }

    // ✅ View Upcoming Appointments
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponseDto>> getUpcomingAppointments() {
        return ResponseEntity.ok(appointmentService.getDoctorUpcomingAppointments());
    }

    // ✅ View History Appointments
    @GetMapping("/history")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponseDto>> getPastAppointments() {
        return ResponseEntity.ok(appointmentService.getDoctorPastAppointments());
    }

    // ✅ Accept an Appointment
    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> acceptAppointment(@PathVariable Long id) {
        appointmentService.acceptAppointment(id);
        return ResponseEntity.ok().build();
    }

    // ✅ Reject an Appointment
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> rejectAppointment(@PathVariable Long id) {
        appointmentService.rejectAppointment(id);
        return ResponseEntity.ok().build();
    }

    // ✅ Reschedule an Appointment
    @PostMapping("/{id}/reschedule")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> rescheduleAppointment(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleRequestDto dto) {
        appointmentService.rescheduleAppointment(id, dto);
        return ResponseEntity.ok().build();
    }

    // ✅ Add or Edit a Note
    @PostMapping("/{id}/note")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> addNoteToAppointment(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequestDto dto) {
        appointmentService.addNoteToAppointment(id, dto);
        return ResponseEntity.ok().build();
    }


}
