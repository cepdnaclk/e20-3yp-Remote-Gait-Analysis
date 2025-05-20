package com._yp.gaitMate.service.processedTestResultsService;


import com._yp.gaitMate.dto.results.ProcessedTestResultsRequestDto;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.repository.ProcessedTestResultsRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.websocket.NotificationMessage;
import com._yp.gaitMate.websocket.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessedTestResultsServiceImpl implements ProcessedTestResultsService{

    private final TestSessionRepository testSessionRepository;
    private final ProcessedTestResultsRepository processedTestResultsRepository;
    private final NotificationService notificationService;


    @Transactional
    @Override
    public void saveResults(ProcessedTestResultsRequestDto dto) {
        // 1. Retrieve the test session
        TestSession session = testSessionRepository.findById(dto.getSessionId())
                .orElse(null);



//        Long deviceId = session.getPatient().getSensorKit().getId();

        boolean isSuccessful = Boolean.TRUE.equals(dto.getStatus());


        if (session == null) {
            log.error("⚠️ Session not found for ID: {}", dto.getSessionId());
        }else if (!isSuccessful) {
            log.error("⚠️ Test session {} marked as FAILED due to processing error", session.getId());

            // Validate session state
            if (!TestSession.Status.PROCESSING.equals(session.getStatus())) {
                log.error("⚠️ Test session {}: Cannot attach results to session that is not in PROCESSING state", session.getId());
            }

            if (session.getResults() != null) {
                log.error("⚠️ Test session {}: Session already has processed results attached", session.getId());
            }

            // 2. Mark session as FAILED if status is false
            session.setStatus(TestSession.Status.FAILED);
            testSessionRepository.save(session);
        }else{
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

        // 5. Notify frontend via WebSocket
        String username = null;
        if (session != null){
            username = session.getPatient().getUser().getUsername();
        }


        NotificationMessage message = NotificationMessage.builder()
                .type("results_ready")
                //.deviceId(deviceId)
                .status(isSuccessful)
                .timestamp(LocalDateTime.now().toString())
                .build();

        notificationService.sendToUser(username, message);
        log.info("✅ WebSocket notification [results_ready] sent to user [{}] for session [{}]", username, session.getId());

    }
}

