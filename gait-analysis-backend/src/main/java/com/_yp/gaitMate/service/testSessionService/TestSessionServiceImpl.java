package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;
import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.SensorKit;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TestSessionServiceImpl implements TestSessionService {

    private final PatientRepository patientRepository;
    private final TestSessionRepository testSessionRepository;
    private final AuthUtil authUtil;

    @Override
    public StartTestSessionResponse startSession(TestSessionActionDto request) {
        // 1. Get the currently logged-in user's ID
        Long userId = authUtil.loggedInUserId();

        // 2. Find the corresponding patient for this user
        Patient patient = patientRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ApiException("Patient not found for user ID: " + userId));

        // 3. Get the patient's assigned SensorKit
        SensorKit sensorKit = patient.getSensorKit();

        // 4. Ensure the patient has a sensor kit assigned
        if (sensorKit == null) {
            throw new ApiException("Patient is not assigned a sensorKit");
        }

        // 5. Prevent starting a new session if one is already active for this patient
        Boolean hasActiveSession = testSessionRepository.existsByPatientAndStatus(patient, TestSession.Status.ACTIVE);
        if (hasActiveSession) {
            throw new ApiException("There is already an active test session for this patient");
        }

        // 6. Ensure the sensor kit is calibrated before starting a session
        if (!sensorKit.getIsCalibrated()) {
            throw new ApiException("SensorKit is not calibrated");
        }

        // 7. Validate the incoming action is "START"
        if (!"START".equalsIgnoreCase(request.getAction())) {
            throw new ApiException("Unsupported action: " + request.getAction());
        }

        // 8. Parse the timestamp from the request and compare to server time
        LocalDateTime serverTime = LocalDateTime.now();
        LocalDateTime startTime = LocalDateTime.parse(request.getTimestamp());

        long diffInSeconds = Math.abs(java.time.Duration.between(serverTime, startTime).getSeconds());

        // 9. Reject if the timestamp is not within ±2 seconds of server time
        if (diffInSeconds > 2) {
            System.out.println(serverTime.toString());
            System.out.println(diffInSeconds);

            throw new ApiException("Start time must be within ±2 seconds of server time");
        }

        // 10. Build and save the new test session
        TestSession session = TestSession.builder()
                .startTime(startTime)
                .status(TestSession.Status.ACTIVE)
                .patient(patient)
                .build();

        session = testSessionRepository.save(session);

        // 11. Return the response with the newly created session ID
        return StartTestSessionResponse.builder()
                .sessionId(session.getId())
                .build();
    }
}
