package com._yp.gaitMate.repository;
import com._yp.gaitMate.model.Clinic;
import java.util.Optional;
import com._yp.gaitMate.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Boolean existsByName(String name);

    List<Doctor> findByClinic(Clinic clinic);
    Optional<Doctor> findByUser_UserId(Long userId);

}

