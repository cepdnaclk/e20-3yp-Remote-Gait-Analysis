package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.TestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessedTestResultsRepository extends JpaRepository<ProcessedTestResults, Long> {
    List<ProcessedTestResults> findBySession_Patient(Patient patient);

    Optional<ProcessedTestResults> findBySession_Id(Long sessionId);

}