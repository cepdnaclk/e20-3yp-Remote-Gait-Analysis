package com._yp.gaitMate.appointment.service;

import com._yp.gaitMate.appointment.dto.AppointmentRequestDto;
import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppointmentService {
    AppointmentResponseDto requestAppointment(AppointmentRequestDto requestDto);

    List<AppointmentResponseDto> getAppointmentsForLoggedInPatient();
}
