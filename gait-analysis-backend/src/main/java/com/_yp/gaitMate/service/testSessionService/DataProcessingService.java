package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.SQS.SqsMessageSender;
import com._yp.gaitMate.dto.testSession.ProcessingRequestDto;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import com._yp.gaitMate.websocket.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataProcessingService {

    private final TestSessionRepository testSessionRepository;
    private final NotificationService notificationService;
    private final AuthUtil authUtil;
    private final SqsMessageSender sqsMessageSender; // ✅ NEW: Inject SQS sender

    /**
     * Sends a processing request to the SQS queue asynchronously.
     * If it fails, marks the session as FAILED.
     *
     * @param request the metadata needed for processing the test session
     */
    @Async
    public void sendProcessingRequest(ProcessingRequestDto request, String username) {
        try {
            log.info("📤 Sending processing request to SQS for session {}", request.getSessionId());
            sqsMessageSender.sendProcessingRequest(request);
            log.info("✅ Processing request enqueued successfully");
        } catch (Exception e) {
            log.error("❌ Failed to send message to SQS: {}", e.getMessage(), e);
            markSessionAsFailed(request.getSessionId());
        }
    }

    private void markSessionAsFailed(Long sessionId) {
        Optional<TestSession> optional = testSessionRepository.findById(sessionId);
        if (optional.isPresent()) {
            TestSession session = optional.get();
            session.setStatus(TestSession.Status.FAILED);
            testSessionRepository.save(session);
            log.warn("⚠️ Test session [{}] marked as FAILED due to message queue failure", sessionId);
        } else {
            log.error("❌ Unable to mark session as FAILED: session ID {} not found", sessionId);
        }
    }
}
