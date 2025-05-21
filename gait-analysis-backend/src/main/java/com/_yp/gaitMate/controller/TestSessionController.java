package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;
import com._yp.gaitMate.dto.testSession.TestSessionDetailsResponse;
import com._yp.gaitMate.service.testSessionService.TestSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/{id}")
    public ResponseEntity<TestSessionDetailsResponse> getSession(@PathVariable("id") Long sessionId) {
        TestSessionDetailsResponse response = testSessionService.getTestSessionById(sessionId);
        return ResponseEntity.ok(response);
    }


}

