package com._yp.gaitMate.appointment.service;

import com._yp.gaitMate.appointment.dto.AppointmentRequestDto;
import com._yp.gaitMate.appointment.dto.AppointmentResponseDto;
import com._yp.gaitMate.appointment.dto.NoteRequestDto;
import com._yp.gaitMate.appointment.dto.RescheduleRequestDto;
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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
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
    @Transactional
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

    @Override
    public List<AppointmentResponseDto> getDoctorAppointmentsByStatus(String status) {
        Doctor doctor = authUtil.getLoggedInDoctor();
        AppointmentStatus parsedStatus = AppointmentStatus.valueOf(status.toUpperCase());

        log.info("Fetching Appointments for doctor [{}] with status [{}]", doctor.getId(), parsedStatus);
        return appointmentRepository.findByDoctorAndStatusOrderByStartTimeAsc(doctor, parsedStatus)
                .stream()
                .map(appointmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDto> getDoctorUpcomingAppointments() {
        Doctor doctor = authUtil.getLoggedInDoctor();
        LocalDateTime now = LocalDateTime.now();

        log.info("Fetching Upcoming Appointments for doctor [{}]", doctor.getId());
        return appointmentRepository.findUpcomingByDoctor(doctor, now)
                .stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED)
                .map(appointmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDto> getDoctorPastAppointments() {
        Doctor doctor = authUtil.getLoggedInDoctor();
        LocalDateTime now = LocalDateTime.now();
        log.info("Fetching Past Appointments for doctor [{}]", doctor.getId());

        return appointmentRepository.findHistoryByDoctor(doctor, now)
                .stream()
                .map(appointmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void acceptAppointment(Long appointmentId) {
        Appointment appointment = findAppointmentForDoctor(appointmentId);

        if (!appointment.getStatus().equals(AppointmentStatus.PENDING)) {
            log.error("can't accept appointment with id [{}]", appointmentId);
            throw new IllegalArgumentException("Only pending appointments can be accepted");
        }

        log.info("validating appointment [{}] has no date conflicts", appointment.getId());
        validateNoConflicts(
                appointment.getDoctor(),
                appointment.getStartTime(),
                appointment.getDurationMinutes(),
                appointment.getId()
        );

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        log.info("Appointment [{}] has been confirmed", appointment.getId());
    }

    @Override
    @Transactional
    public void rejectAppointment(Long appointmentId) {
        Appointment appointment = findAppointmentForDoctor(appointmentId);
        if (!appointment.getStatus().equals(AppointmentStatus.PENDING)) {
            throw new IllegalArgumentException("Only pending appointments can be rejected");
        }
        appointment.setStatus(AppointmentStatus.REJECTED);
        log.info("Appointment [{}] has been rejected", appointment.getId());

    }

    @Override
    @Transactional
    public void rescheduleAppointment(Long appointmentId, RescheduleRequestDto dto) {
        Appointment appointment = findAppointmentForDoctor(appointmentId);

        if (appointment.getStatus().equals(AppointmentStatus.COMPLETED)) {
            throw new IllegalArgumentException("Cannot reschedule a completed appointment");
        }
        if (dto.getNewTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reschedule time must be in the future");
        }

        log.info("Validating appointment [{}] has no date conflicts", appointment.getId());
        validateNoConflicts(
                appointment.getDoctor(),
                dto.getNewTime(),
                appointment.getDurationMinutes(),
                appointment.getId()
        );

        appointment.setStartTime(dto.getNewTime());
        log.info("Appointment [{}] has been rescheduled", appointment.getId());
    }

    @Override
    @Transactional
    public void addNoteToAppointment(Long appointmentId, NoteRequestDto dto) {
        Appointment appointment = findAppointmentForDoctor(appointmentId);
        appointment.setNotes(dto.getNote());
        log.info("Note added to appointment [{}]", appointment.getId());
    }

    @Override
    public Appointment findByIdForDoctorOrPatient(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if(authUtil.isDoctor()){
            Doctor doctor = authUtil.getLoggedInDoctor();
            if(!appointment.getDoctor().getId().equals(doctor.getId())){
                throw new AccessDeniedException("You are not authorized to view this appointment");
            }
        }else if(authUtil.isPatient()){
            Patient patient = authUtil.getLoggedInPatient();
            if(!appointment.getPatient().getId().equals(patient.getId())){
                throw new AccessDeniedException("You are not authorized to view this appointment");
            }
        }else{
            throw new AccessDeniedException("You are not authorized to view this appointment");
        }

        return appointment;
    }

    // private helper methods

    private void validateNoConflicts(Doctor doctor, LocalDateTime start, int duration, Long excludeId) {
        LocalDateTime end = start.plusMinutes(duration);
        boolean hasConflict = !appointmentRepository
                .findOverlappingAppointments(doctor, start, end, excludeId)
                .isEmpty();

        if (hasConflict) {
            throw new IllegalArgumentException("Appointment time conflicts with an existing appointment");
        }
    }

    private Appointment findAppointmentForDoctor(Long id) {
        Doctor doctor = authUtil.getLoggedInDoctor();
        return appointmentRepository.findById(id)
                .filter(a -> a.getDoctor().getId().equals(doctor.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
    }

}
