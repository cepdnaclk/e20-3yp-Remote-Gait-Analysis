package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.TestSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, Long> {
    Boolean existsByPatientAndStatus(Patient patient, TestSession.Status status);


    Page<TestSession> findAllByPatient(Patient patient , Pageable pageable);

    Page<TestSession> findByPatient_Doctor_IdAndStatusIn(
            Long doctorId,
            List<TestSession.Status> statuses,
            Pageable pageable
    );


    List<TestSession> findByPatientOrderByStartTimeDesc(Patient patient);

    Optional<TestSession> findTop1ByPatientAndStatusOrderByStartTimeDesc(Patient patient, TestSession.Status status);

}