package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.doctor.DoctorTestReportDto;
import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;
import com._yp.gaitMate.dto.testSession.TestSessionDetailsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TestSessionService {
    StartTestSessionResponse startSession(TestSessionActionDto request);

    ApiResponse stopSession(Long sessionId, TestSessionActionDto request);

    TestSessionDetailsResponse getTestSessionById(Long sessionId);

    List<TestSessionDetailsResponse> getSessionsOfLoggedInPatient();

    List<TestSessionDetailsResponse> getSessionsByIdOfPatientsOfLoggedInDoctor(Long id);

    Page<DoctorTestReportDto> getReportsOfLoggedInDoctor(Pageable pageable);
}
