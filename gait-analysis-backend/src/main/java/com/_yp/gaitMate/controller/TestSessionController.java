package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.doctor.DoctorTestReportDto;
import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;
import com._yp.gaitMate.dto.testSession.TestSessionDetailsResponse;
import com._yp.gaitMate.service.testSessionService.TestSessionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-sessions")
@RequiredArgsConstructor
public class TestSessionController {

    private final TestSessionService testSessionService;

    /**
     * Starts a new test session for the logged-in patient.
     *
     * @param request the action and timestamp to initiate the session
     * @return the ID of the newly created session
     */
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping
    public ResponseEntity<StartTestSessionResponse> startTestSession(
            @RequestBody @Valid TestSessionActionDto request) {
        StartTestSessionResponse response = testSessionService.startSession(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PutMapping("/{sessionId}")
    public ResponseEntity<ApiResponse> stopTestSession(
            @PathVariable Long sessionId,
            @RequestBody @Valid TestSessionActionDto request) {

        ApiResponse response = testSessionService.stopSession(sessionId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    /**
     * Retrieves full session details, including results, feedback, and raw data path.
     * Only accessible by the patient who owns the session.
     *
     * @param sessionId ID of the test session
     * @return Full session DTO
     */
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    @GetMapping("/{id}")
    @Operation(
            summary = "Get session details by session-id"
    )
    public ResponseEntity<TestSessionDetailsResponse> getSession(@PathVariable("id") Long sessionId) {
        TestSessionDetailsResponse response = testSessionService.getTestSessionById(sessionId);
        return ResponseEntity.ok(response);
    }



    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")
    @Operation(
            summary = "Get all sessions details of the logged in patient"
    )
    public ResponseEntity<PageResponseDto<TestSessionDetailsResponse>> getSessionsOfLoggedInPatient(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        PageResponseDto<TestSessionDetailsResponse> response = testSessionService.getSessionsOfLoggedInPatient(pageable);

        return ResponseEntity.ok(response);
    }


    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctors/me/patients/{patient-id}")
    @Operation(
            summary = "Get session details of the selected patient of the logged in doctor"
    )
    public ResponseEntity<List<TestSessionDetailsResponse>> getSessionsByIdOfPatientsOfLoggedInDoctor(@PathVariable("patient-id") Long id) {
        List<TestSessionDetailsResponse> response = testSessionService.getSessionsByIdOfPatientsOfLoggedInDoctor(id);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/doctors/me/reports")
//    @PreAuthorize("hasRole('DOCTOR')")
//    @Operation(summary = "Get all test reports of patients assigned to the logged-in doctor")
//    public ResponseEntity<PageResponseDto<DoctorTestReportDto>> getTestReportsOfLoggedInDoctor(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        Pageable pageable = PageRequest.of(page, size);
//        PageResponseDto<DoctorTestReportDto> reports = testSessionService.getReportsOfLoggedInDoctor(pageable);
//        return ResponseEntity.ok(reports);
//    }


}

