package com._yp.gaitMate.service.processedTestResultsService;

import com._yp.gaitMate.dto.results.ProcessedTestResultsRequestDto;
import jakarta.transaction.Transactional;

public interface ProcessedTestResultsService {
    @Transactional
    void saveResults(ProcessedTestResultsRequestDto dto);
}
