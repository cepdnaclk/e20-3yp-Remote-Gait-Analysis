package com._yp.gaitMate.service.processedTestResultsService;


import com._yp.gaitMate.dto.results.ProcessedTestResultsRequestDto;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.repository.ProcessedTestResultsRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessedTestResultsServiceImpl implements ProcessedTestResultsService{

    private final TestSessionRepository testSessionRepository;
    private final ProcessedTestResultsRepository processedTestResultsRepository;

    @Transactional
    @Override
    public void saveResults(ProcessedTestResultsRequestDto dto) {
        // 1. Find session
        TestSession session = testSessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new ApiException("Test session not found with ID: " + dto.getSessionId()));

        // 2. Validate session state
        if (!TestSession.Status.PROCESSING.equals(session.getStatus())) {
            throw new ApiException("Cannot attach results to session that is not in PROCESSING state");
        }

        if (session.getResults() != null) {
            throw new ApiException("Session already has processed results attached");
        }

        // 3. Build results
        ProcessedTestResults results = ProcessedTestResults.builder()
                .cadence(dto.getCadence())
                .stepLength(dto.getStepLength())
                .strideLength(dto.getStrideLength())
                .stepTime(dto.getStepTime())
                .strideTime(dto.getStrideTime())
                .speed(dto.getSpeed())
                .symmetryIndex(dto.getSymmetryIndex())
                .pressureResultsPath(dto.getPressureResultsPath())
                .build();

        processedTestResultsRepository.save(results);

        // 4. Attach results to session
        session.setResults(results);
        session.setStatus(TestSession.Status.COMPLETED);
        testSessionRepository.save(session);

        log.info("✅ Processed results saved and session {} marked as COMPLETED", session.getId());
    }
}

