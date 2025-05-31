package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.TestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, Long> {
    Boolean existsByPatientAndStatus(Patient patient, TestSession.Status status);


    List<TestSession> findAllByPatient(Patient patient);
}