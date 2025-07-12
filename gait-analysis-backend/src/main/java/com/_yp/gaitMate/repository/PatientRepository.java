package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.model.Patient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import com._yp.gaitMate.model.Doctor;


@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByName(String name);
    boolean existsByNic(String nic);

    Page<Patient> findByDoctor(Doctor doctor , Pageable pageable);
    Optional<Patient> findByUser_UserId(Long userUserId);


//    Optional<Patient> findByUser_UserId(Long userUserId);

    List<Patient> findByClinic(Clinic clinic);

    Optional<Patient> findByInvitationToken(String token);

    boolean existsByEmail(String email);
}