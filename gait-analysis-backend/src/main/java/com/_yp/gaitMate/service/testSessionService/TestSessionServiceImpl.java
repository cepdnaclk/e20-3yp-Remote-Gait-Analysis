package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.doctor.DoctorTestReportDto;
import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import com._yp.gaitMate.dto.testSession.*;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.mapper.PageMapper;
import com._yp.gaitMate.mapper.TestSessionMapper;
import com._yp.gaitMate.model.*;
import com._yp.gaitMate.mqtt.core.MqttPublisher;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import com.amazonaws.services.iot.client.AWSIotQos;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestSessionServiceImpl implements TestSessionService {

    private static final Logger log = LoggerFactory.getLogger(TestSessionServiceImpl.class);
    private final PatientRepository patientRepository;
    private final TestSessionRepository testSessionRepository;
    private final AuthUtil authUtil;
    private final MqttPublisher mqttPublisher;
    private final DataProcessingService dataProcessingService;
    private final TestSessionMapper testSessionMapper;
    private final PageMapper pageMapper;



    @Override
    public StartTestSessionResponse startSession(TestSessionActionDto request) {
        // 1. Validate action
        validateAction(request.getAction(), TestSessionActionType.START);

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

        log.info("✅ New test session {} started", session.getId());
        // 7. Return response
        return StartTestSessionResponse.builder()
                .sessionId(session.getId())
                .build();
    }

    @Override
    public ApiResponse stopSession(Long sessionId, TestSessionActionDto request) {
        // 1. Validate action
        validateAction(request.getAction(), TestSessionActionType.STOP);

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

        // 9. Create patient info response
        PatientInfoResponse patientInfo = PatientInfoResponse.builder()
                .id(patient.getId())
                .name(patient.getName())
                .email(patient.getEmail())
                .phoneNumber(patient.getPhoneNumber())
                .age(patient.getAge())
                .height(patient.getHeight())
                .weight(patient.getWeight())
                .gender(patient.getGender().name())
                .createdAt(patient.getCreatedAt() != null ? patient.getCreatedAt().toString() : null)
                .doctorId(patient.getDoctor() != null ? patient.getDoctor().getId() : null)
                .doctorName(patient.getDoctor() != null ? patient.getDoctor().getName() : null)
                .sensorKitId(sensorKit != null ? sensorKit.getId() : null)
                .nic(patient.getNic())
                .build();

// 10. Trigger asynchronous processing request
        ProcessingRequestDto processingRequest = ProcessingRequestDto.builder()
                .sensorId(sensorKit.getId())
                .startTime(session.getStartTime().toString())
                .endTime(session.getEndTime().toString())
                .sessionId(session.getId())
                .patientInfo(patientInfo)  // <- ADD THIS LINE
                .build();


        String username = patient.getUser().getUsername();
        dataProcessingService.sendProcessingRequest(processingRequest, username);
        log.info("🚀 Processing request dispatched asynchronously for session {}", session.getId());

        return new ApiResponse("Processing started", true);
    }

    @Override
    public TestSessionDetailsResponse getTestSessionById(Long sessionId) {
        // TODO: implement access to the doctor of the patient as well
        Long userId = authUtil.loggedInUserId();

        TestSession session = testSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException("Test session not found for ID: " + sessionId));

        // Verify the user owns this session or user is the doctor of the session owned patient
        if (session.getPatient().getUser().getUserId().equals(userId)
        || session.getPatient().getDoctor().getUser().getUserId().equals(userId)) {
            return testSessionMapper.toDetailsResponse(session);
        }

        throw new ApiException("Unauthorized access to this test session");

    }

    @Override
    public PageResponseDto<TestSessionDetailsResponse> getSessionsOfLoggedInPatient(Pageable pageable) {
        Patient loggedInPatient = authUtil.getLoggedInPatient();

        Page<TestSession> sessions = testSessionRepository.findAllByPatient(loggedInPatient,pageable);

        Page<TestSessionDetailsResponse> responses = sessions.map(testSessionMapper::toDetailsResponse);

        return pageMapper.toPageResponse(responses);
    }

    @Override
    public List<TestSessionDetailsResponse> getSessionsByIdOfPatientsOfLoggedInDoctor(Long id) {
        Doctor doctor = authUtil.getLoggedInDoctor();

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ApiException("Patient not found for ID: " + id));

        if (patient.getDoctor().getId() != doctor.getId()){
            throw new ApiException("This patient is not registered under you");
        }

        List<TestSession> testSessions = patient.getTestSessions();

        return testSessions.stream()
                .map(testSessionMapper::toDetailsResponse)
                .toList();
    }

    @Override
    public PageResponseDto<DoctorTestReportDto> getReportsOfLoggedInDoctor(Pageable pageable) {

        Long doctorID = authUtil.getLoggedInDoctor().getId();

        Page<TestSession> sessions = testSessionRepository.findByPatient_Doctor_IdAndStatus(doctorID, TestSession.Status.COMPLETED, pageable);

        Page<DoctorTestReportDto> dtoPage = sessions.map(testSessionMapper::toDoctorTestReportDto);

        return pageMapper.toPageResponse(dtoPage);
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
            String topic = "device/" + sensorId + "/command";
            String payload = "{ \"command\": \"stop_streaming\" }";

            mqttPublisher.publishBlocking(topic, payload, AWSIotQos.QOS1);

        } catch (Exception e) {
            log.error("❌ Failed to send STOP command via MQTT: {}", e.getMessage());
            throw new ApiException("Session stopped, but failed to notify SensorKit via MQTT: " + e.getMessage());
        }
    }

    /**
     * Validates that the action matches the expected keyword.
     */
    private void validateAction(TestSessionActionType inputAction, TestSessionActionType expectedAction) {
        if (!expectedAction.equals(inputAction)) {
            throw new ApiException("Unsupported action: " + inputAction);
        }
    }

    /**
     * Gets the currently logged-in patient based on the JWT user ID.
     */
    private Patient getLoggedInPatient() {
        Long userId = authUtil.loggedInUserId();

        return patientRepository.findByUser_UserId(userId)
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
     * Parses and validates that the timestamp is close to server time (±5 seconds).
     */
    private LocalDateTime validateTimestampCloseToNow(Instant timestamp) {
        LocalDateTime parsed = timestamp.atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime now = LocalDateTime.now();

        long diffInSeconds = Math.abs(java.time.Duration.between(now, parsed).getSeconds());

//        if (diffInSeconds > 5) {
//            throw new ApiException("Timestamp must be within ±5 seconds of server time");
//        }

        return parsed;
    }
}
