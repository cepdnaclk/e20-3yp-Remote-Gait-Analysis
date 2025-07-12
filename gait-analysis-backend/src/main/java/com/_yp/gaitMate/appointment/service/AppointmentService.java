package com._yp.gaitMate.appointment.service;

import com._yp.gaitMate.appointment.dto.AppointmentRequestDto;
import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import com._yp.gaitMate.appointment.dto.NoteRequestDto;
import com._yp.gaitMate.appointment.dto.RescheduleRequestDto;
import com._yp.gaitMate.model.Appointment;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppointmentService {
    AppointmentResponseDto requestAppointment(AppointmentRequestDto requestDto);

    List<AppointmentResponseDto> getAppointmentsForLoggedInPatient();

    List<AppointmentResponseDto> getDoctorAppointmentsByStatus(String pending);

    List<AppointmentResponseDto> getDoctorUpcomingAppointments();

    List<AppointmentResponseDto> getDoctorPastAppointments();

    void acceptAppointment(Long id);

    void rejectAppointment(Long id);

    void rescheduleAppointment(Long id, @Valid RescheduleRequestDto dto);

    void addNoteToAppointment(Long id, @Valid NoteRequestDto dto);

    Appointment findByIdForDoctorOrPatient(Long appointmentId);
}
