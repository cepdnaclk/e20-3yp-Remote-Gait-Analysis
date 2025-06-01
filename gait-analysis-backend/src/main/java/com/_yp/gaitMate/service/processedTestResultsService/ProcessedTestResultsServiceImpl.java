package com._yp.gaitMate.service.processedTestResultsService;

import com._yp.gaitMate.dto.results.ProcessedTestResultsRequestDto;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.repository.ProcessedTestResultsRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.websocket.message.ResultsNotificationMessage;
import com._yp.gaitMate.websocket.NotificationService;
import com._yp.gaitMate.websocket.message.WebSocketMessageType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessedTestResultsServiceImpl implements ProcessedTestResultsService {

    private final TestSessionRepository testSessionRepository;
    private final ProcessedTestResultsRepository processedTestResultsRepository;
    private final NotificationService notificationService;

    @Transactional
    @Override
    public void saveResults(ProcessedTestResultsRequestDto dto) {
        // 1. Retrieve the test session
        TestSession session = testSessionRepository.findById(dto.getSessionId()).orElse(null);
        boolean isSuccessful = Boolean.TRUE.equals(dto.getStatus());

        if (session == null) {
            log.error("⚠️ Session not found for ID: {}", dto.getSessionId());
            return;
        }

        if (!isSuccessful) {
            log.error("⚠️ Test session {} marked as FAILED due to processing error", session.getId());

            // 2. Mark session as FAILED if status is false
            if (!TestSession.Status.PROCESSING.equals(session.getStatus())) {
                log.error("⚠️ Test session {}: Cannot attach results to session that is not in PROCESSING state", session.getId());
            }

            if (session.getResults() != null) {
                log.error("⚠️ Test session {}: Session already has processed results attached", session.getId());
            }

            session.setStatus(TestSession.Status.FAILED);
            testSessionRepository.save(session);
        } else {
            // 3. Build and save results
            ProcessedTestResults results = ProcessedTestResults.builder()
                    .steps(dto.getSteps())
                    .cadence(dto.getCadence())
                    .avgHeelForce(dto.getAvgHeelForce())
                    .avgToeForce(dto.getAvgToeForce())
                    .avgMidfootForce(dto.getAvgMidfootForce())
                    .balanceScore(dto.getBalanceScore())
                    .peakImpact(dto.getPeakImpact())
                    .durationSeconds(dto.getDurationSeconds())
                    .avgSwingTime(dto.getAvgSwingTime())
                    .avgStanceTime(dto.getAvgStanceTime())
                    .pressureResultsPath(dto.getPressureResultsPath())
                    .strideTimes(dto.getStrideTimes()) // ✅ saving the list
                    .session(session) // ✅ set owning side of relationship
                    .build();

            processedTestResultsRepository.save(results);

            // 4. Attach results to session and update status
            session.setResults(results);
            session.setStatus(TestSession.Status.COMPLETED);
            testSessionRepository.save(session);

            log.info("✅ Processed results saved and session {} marked as COMPLETED", session.getId());
        }

        // 5. Notify frontend via WebSocket
        String username = session.getPatient().getUser().getUsername();

        ResultsNotificationMessage message = ResultsNotificationMessage.builder()
                .sessionId(dto.getSessionId())
                .type(WebSocketMessageType.RESULTS_READY)
                .status(isSuccessful)
                .timestamp(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())
                .build();

        notificationService.sendNotificationToUser(username, message);
        log.info("✅ WebSocket notification [results_ready] sent to user [{}] for session [{}]", username, session.getId());
    }
}
