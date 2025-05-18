package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.testSession.ProcessingRequestDto;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.repository.TestSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

/**
 * Sends test session metadata to the data processing microservice asynchronously.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DataProcessingService {

    private final RestTemplate restTemplate;
    private final TestSessionRepository testSessionRepository;

    @Value("${microservices.data.processing.url}")
    private String PROCESSING_URL;

    /**
     * Sends a POST request to the FastAPI microservice with sensor test session info.
     * If it fails, marks the session as FAILED.
     *
     * @param request the metadata needed for processing the test session
     */
    @Async
    public void sendProcessingRequest(ProcessingRequestDto request) {
        try {
            log.info("📤 Sending async processing request for session {}", request.getSessionId());
            restTemplate.postForEntity(PROCESSING_URL, request, Void.class);
            log.info("✅ Processing request sent successfully");
        } catch (Exception e) {
            log.error("❌ Failed to send processing request: {}", e.getMessage(), e);
            markSessionAsFailed(request.getSessionId());
        }
    }

    private void markSessionAsFailed(Long sessionId) {
        Optional<TestSession> optional = testSessionRepository.findById(sessionId);
        if (optional.isPresent()) {
            TestSession session = optional.get();
            session.setStatus(TestSession.Status.FAILED);
            testSessionRepository.save(session);
            log.warn("⚠️ Test session [{}] marked as FAILED due to processing dispatch failure", sessionId);
        } else {
            log.error("❌ Unable to mark session as FAILED: session ID {} not found", sessionId);
        }
    }
}

