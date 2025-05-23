package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import com._yp.gaitMate.model.Doctor;


@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByName(String name);
    boolean existsByNic(String nic);

    Optional<Patient> findById(Long userUserId);
    List<Patient> findByDoctor(Doctor doctor);
    Optional<Patient> findByUser_UserId(Long userUserId);


}