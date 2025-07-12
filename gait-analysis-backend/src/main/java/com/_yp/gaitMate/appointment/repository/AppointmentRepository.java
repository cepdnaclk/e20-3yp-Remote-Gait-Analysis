package com._yp.gaitMate.appointment.repository;

import com._yp.gaitMate.model.Appointment;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Patient-side
    List<Appointment> findByPatientOrderByStartTimeDesc(Patient patient);

    // Doctor dashboard: status-filtered appointments
    List<Appointment> findByDoctorAndStatusOrderByStartTimeAsc(Doctor doctor, AppointmentStatus status);

    // Optional: Upcoming and History as time-based views
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.startTime > :now ORDER BY a.startTime ASC")
    List<Appointment> findUpcomingByDoctor(Doctor doctor, LocalDateTime now);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.startTime <= :now ORDER BY a.startTime DESC")
    List<Appointment> findHistoryByDoctor(Doctor doctor, LocalDateTime now);

    // Prevent double-booking (e.g., for rescheduling)
    @Query("""
           SELECT a FROM Appointment a 
           WHERE a.doctor = :doctor 
           AND a.startTime < :end 
           AND :start < (a.startTime + (a.durationMinutes * 1 minute)) 
           AND a.status IN ('PENDING', 'CONFIRMED')
           AND a.id <> :excludeId
           """)
    List<Appointment> findOverlappingAppointments(Doctor doctor, LocalDateTime start, LocalDateTime end, Long excludeId);
}
