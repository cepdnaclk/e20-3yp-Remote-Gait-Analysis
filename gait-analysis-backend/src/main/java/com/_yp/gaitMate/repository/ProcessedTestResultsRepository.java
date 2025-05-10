package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.ProcessedTestResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedTestResultsRepository extends JpaRepository<ProcessedTestResults, Long> {
}