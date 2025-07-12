package com._yp.gaitMate.appointment.service;

import com._yp.gaitMate.appointment.dto.AppointmentRequestDto;
import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import com._yp.gaitMate.appointment.mapper.AppointmentMapper;
import com._yp.gaitMate.appointment.repository.AppointmentRepository;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.model.Appointment;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.enums.AppointmentCreatedBy;
import com._yp.gaitMate.model.enums.AppointmentStatus;
import com._yp.gaitMate.repository.DoctorRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final AuthUtil authUtil;
    private final DoctorRepository doctorRepository;



    @Override
    public AppointmentResponseDto requestAppointment(AppointmentRequestDto requestDto) {

        if (requestDto.getRequestedTime().isBefore(LocalDateTime.now())) {
            throw new ApiException("Requested appointment time must be in the future");
        }

        Patient patient = authUtil.getLoggedInPatient();

        Doctor doctor = doctorRepository.findById(requestDto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", requestDto.getDoctorId()));

        log.info("Patient [{}] is requesting an appointment with doctor [{}] at [{}]",
                patient.getId(), doctor.getId(), requestDto.getRequestedTime());

        Appointment request = appointmentMapper.toEntity(requestDto , doctor ,patient);

        request.setCreatedBy(AppointmentCreatedBy.PATIENT);
        request.setStatus(AppointmentStatus.PENDING);
        Appointment saved = appointmentRepository.save(request);

        if (saved.getId() == null) {
            log.error("Appointment creation failed — no ID returned");
            throw new RuntimeException("Appointment could not be created");
        }

        log.info("Appointment [{}] created successfully", saved.getId());

        return appointmentMapper.toResponseDto(saved);
    }

    @Override
    public List<AppointmentResponseDto> getAppointmentsForLoggedInPatient() {
        Patient patient = authUtil.getLoggedInPatient();

        log.info("Fetching appointments for patient [{}]", patient.getId());

        return appointmentRepository.findByPatientOrderByStartTimeDesc(patient)
                .stream()
                .map(appointmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
