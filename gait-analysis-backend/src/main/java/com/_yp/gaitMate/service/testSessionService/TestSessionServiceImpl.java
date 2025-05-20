package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.testSession.ProcessingRequestDto;
import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;
import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.SensorKit;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.mqtt.core.MqttPublisher;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TestSessionServiceImpl implements TestSessionService {

    private static final Logger log = LoggerFactory.getLogger(TestSessionServiceImpl.class);
    private final PatientRepository patientRepository;
    private final TestSessionRepository testSessionRepository;
    private final AuthUtil authUtil;
    private final MqttPublisher mqttPublisher;
    private final DataProcessingService dataProcessingService;


    @Override
    public StartTestSessionResponse startSession(TestSessionActionDto request) {
        // 1. Validate action
        validateAction(request.getAction(), "START");

        // 2. Get current patient from user context
        Patient patient = getLoggedInPatient();

        // 3. Validate sensor kit
        SensorKit sensorKit = validateSensorKit(patient);

        // 4. Ensure no active session exists
        if (testSessionRepository.existsByPatientAndStatus(patient, TestSession.Status.ACTIVE)) {
            throw new ApiException("There is already an active test session for this patient");
        }

        // 5. Validate timestamp
        LocalDateTime startTime = validateTimestampCloseToNow(request.getTimestamp());

        // 6. Build and save new test session
        TestSession session = TestSession.builder()
                .startTime(startTime)
                .status(TestSession.Status.ACTIVE)
                .patient(patient)
                .build();

        session = testSessionRepository.save(session);

        // 7. Return response
        return StartTestSessionResponse.builder()
                .sessionId(session.getId())
                .build();
    }

    @Override
    public ApiResponse stopSession(Long sessionId, TestSessionActionDto request) {
        // 1. Validate action
        validateAction(request.getAction(), "STOP");

        // 2. Get current patient from user context
        Patient patient = getLoggedInPatient();

        // 3. Find test session by ID
        TestSession session = testSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException("Test session not found for ID: " + sessionId));

        // 4. Check session ownership
        if (!session.getPatient().getId().equals(patient.getId())) {
            throw new ApiException("Unauthorized: You do not own this session");
        }

        // 5. Ensure session is ACTIVE
        if (!TestSession.Status.ACTIVE.equals(session.getStatus())) {
            throw new ApiException("Session is not active");
        }

        // 6. Validate timestamp
        LocalDateTime stopTime = validateTimestampCloseToNow(request.getTimestamp());

        if (!stopTime.isAfter(session.getStartTime())) {
            throw new ApiException("Stop time must be after the session start time");
        }

        // 7. Update and save session
        session.setEndTime(stopTime);
        session.setStatus(TestSession.Status.PROCESSING);
        testSessionRepository.save(session);

        log.info("✅ Session stopped successfully in the database.");

        // 8. publish MQTT STOP command
        SensorKit sensorKit = patient.getSensorKit();
        sendStopCommandToSensor(sensorKit);

        // 9. Trigger asynchronous processing
        ProcessingRequestDto processingRequest = ProcessingRequestDto.builder()
                .sensorId(sensorKit.getId())
                .startTime(session.getStartTime().toString())
                .endTime(session.getEndTime().toString())
                .sessionId(session.getId())
                .build();

        dataProcessingService.sendProcessingRequest(processingRequest);
        log.info("🚀 Processing request dispatched asynchronously for session {}", session.getId());

        return new ApiResponse("Processing started", true);
    }

    // =====================================
    // 🔽 PRIVATE HELPERS
    // =====================================


    /**
     * Publishes a STOP command to the sensor's MQTT topic.
     * Does not throw if publishing fails — returns fallback response instead.
     *
     * @param sensorKit the sensor assigned to the patient
     * @return null if successful, or an ApiResponse indicating failure
     */
    private void sendStopCommandToSensor(SensorKit sensorKit) {
        try {
            Long sensorId = sensorKit.getId();
            String topic = "sensors/" + sensorId + "/command";
            String payload = "{ \"action\": \"STOP\" }";

            mqttPublisher.publishBlocking(topic, payload, AWSIotQos.QOS1);

        } catch (Exception e) {
            log.error("❌ Failed to send STOP command via MQTT: {}", e.getMessage());
            throw new ApiException("Session stopped, but failed to notify SensorKit via MQTT: " + e.getMessage());
        }
    }

    /**
     * Validates that the action matches the expected keyword.
     */
    private void validateAction(String inputAction, String expectedAction) {
        if (!expectedAction.equalsIgnoreCase(inputAction)) {
            throw new ApiException("Unsupported action: " + inputAction);
        }
    }

    /**
     * Gets the currently logged-in patient based on the JWT user ID.
     */
    private Patient getLoggedInPatient() {
        Long userId = authUtil.loggedInUserId();

        return patientRepository.findById(userId)
                .orElseThrow(() -> new ApiException("Patient not found for user ID: " + userId));
    }

    /**
     * Validates that the patient has a usable sensor kit.
     */
    private SensorKit validateSensorKit(Patient patient) {
        SensorKit sensorKit = patient.getSensorKit();

        if (sensorKit == null) {
            throw new ApiException("Patient is not assigned a sensorKit");
        }

        if (!sensorKit.getStatus().equals(SensorKit.Status.IN_USE)) {
            throw new ApiException("Invalid sensor-kit status: " + sensorKit.getStatus().name());
        }

        if (!sensorKit.getIsCalibrated()) {
            throw new ApiException("SensorKit is not calibrated");
        }

        return sensorKit;
    }

    /**
     * Parses and validates that the timestamp is close to server time (±2 seconds).
     */
    private LocalDateTime validateTimestampCloseToNow(String timestampStr) {
        LocalDateTime parsed = LocalDateTime.parse(timestampStr);
        LocalDateTime now = LocalDateTime.now();

        long diffInSeconds = Math.abs(java.time.Duration.between(now, parsed).getSeconds());

        // ⚠️ Uncomment this if needed for testing
        if (diffInSeconds > 2) {
            throw new ApiException("Timestamp must be within ±2 seconds of server time");
        }

        return parsed;
    }
}
