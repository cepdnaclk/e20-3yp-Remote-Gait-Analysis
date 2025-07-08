package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.ProcessedTestResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessedTestResultsRepository extends JpaRepository<ProcessedTestResults, Long> {
    List<ProcessedTestResults> findBySession_Patient(Patient patient);
}