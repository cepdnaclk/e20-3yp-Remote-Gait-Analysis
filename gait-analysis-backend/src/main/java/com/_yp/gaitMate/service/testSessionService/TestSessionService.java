package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.doctor.DoctorTestReportDto;
import com._yp.gaitMate.dto.feedback.FeedbackDto;
import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;
import com._yp.gaitMate.dto.testSession.TestSessionDetailsResponse;
import com._yp.gaitMate.model.Doctor;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TestSessionService {
    StartTestSessionResponse startSession(TestSessionActionDto request);

    ApiResponse stopSession(Long sessionId, TestSessionActionDto request);

    TestSessionDetailsResponse getTestSessionById(Long sessionId);

    PageResponseDto<TestSessionDetailsResponse> getSessionsOfLoggedInPatient(Pageable pageable);

    List<TestSessionDetailsResponse> getSessionsByIdOfPatientsOfLoggedInDoctor(Long id);

    PageResponseDto<DoctorTestReportDto> getReportsOfLoggedInDoctor(Pageable pageable);

    void createOrUpdateFeedback(Long sessionId, FeedbackDto feedbackDto, Doctor doctor);
}
