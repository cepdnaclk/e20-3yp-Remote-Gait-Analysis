package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Boolean existsByName(String name);
}

