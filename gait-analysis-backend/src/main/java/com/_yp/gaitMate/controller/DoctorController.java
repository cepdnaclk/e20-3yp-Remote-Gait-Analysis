package com._yp.gaitMate.controller;
import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.dto.doctor.DoctorTestReportDto;
import com._yp.gaitMate.dto.feedback.FeedbackDto;
import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.patient.PatientDashboardStatsDto;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.service.doctorService.DoctorService;
import com._yp.gaitMate.service.patientService.PatientService;
import com._yp.gaitMate.service.testSessionService.TestSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.mapper.PatientMapper;
import com._yp.gaitMate.security.utils.AuthUtil;

import java.util.List;

@RestController
@RequestMapping("api/")
@RequiredArgsConstructor
public class DoctorController {

    private final AuthUtil authUtil;
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final TestSessionService testSessionService;


//    public DoctorController(DoctorService doctorService) {
//        this.doctorService = doctorService;
//    }

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(
            summary = "Register a new doctor (Clinic only)",
            description = "Allows a logged-in clinic to create a doctor account under their clinic.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Doctor created successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = DoctorInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 5,\n" +
                                                    "  \"name\": \"Dr. Malithi Fernando\",\n" +
                                                    "  \"email\": \"malithi@careclinic.com\",\n" +
                                                    "  \"phoneNumber\": \"0784561230\",\n" +
                                                    "  \"specialization\": \"Physiotherapist\",\n" +
                                                    "  \"profilePicture\": null,\n" +
                                                    "  \"createdAt\": \"2025-05-11T22:15:12.456\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input or username/email already exists",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = com._yp.gaitMate.dto.ApiResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"message\": \"Doctor with username or email already exists\",\n" +
                                                    "  \"status\": false\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Access denied (Forbidden)",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"timestamp\": \"2025-05-11T19:02:50.001+00:00\",\n" +
                                                    "  \"status\": 403,\n" +
                                                    "  \"error\": \"Forbidden\",\n" +
                                                    "  \"path\": \"/api/doctors\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"path\": \"/api/doctors\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Full authentication is required to access this resource\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<DoctorInfoResponse> createDoctor(@RequestBody @Valid CreateDoctorRequest request) {
        DoctorInfoResponse response = doctorService.createDoctor(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

//    @GetMapping("/clinics/me/doctors")
//    @PreAuthorize("hasRole('CLINIC')")
//    @Operation(summary = "Get doctors of the logged-in clinic")
//    public ResponseEntity<List<DoctorInfoResponse>> getDoctorsOfLoggedInClinic() {
//        List<DoctorInfoResponse> doctors = doctorService.getDoctorsOfLoggedInClinic();
//        return new ResponseEntity<>(doctors, HttpStatus.OK);
//    }

    @GetMapping("/clinics/me/doctors")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(summary = "Get paginated doctors of the logged-in clinic")
    public ResponseEntity<PageResponseDto<DoctorInfoResponse>> getDoctorsOfLoggedInClinic(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PageResponseDto<DoctorInfoResponse> response = doctorService.getDoctorsOfLoggedInClinic(pageable);
        return ResponseEntity.ok(response);
    }



    @GetMapping("/doctors/me/patients")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get the logged in doctor's patients")
    public ResponseEntity<PageResponseDto<PatientInfoResponse>> getPatientsOfLoggedInDoctor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        PageResponseDto<PatientInfoResponse> patients = patientService.getPatientsOfLoggedInDoctor(pageable);

        return ResponseEntity.ok(patients);
    }


    @GetMapping("test-sessions/doctors/me/reports")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get all test reports of patients assigned to the logged-in doctor")
    public ResponseEntity<PageResponseDto<DoctorTestReportDto>> getTestReportsOfLoggedInDoctor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PageResponseDto<DoctorTestReportDto> reports = testSessionService.getReportsOfLoggedInDoctor(pageable);
        return ResponseEntity.ok(reports);
    }


    @PutMapping("test-sessions/{sessionId}/feedback")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Create or update feedback for a completed test session")
    public ResponseEntity<Void> createOrUpdateFeedback(
            @PathVariable Long sessionId,
            @Valid @RequestBody FeedbackDto feedbackDto) {

        Doctor doctor = authUtil.getLoggedInDoctor(); // ✅ Use your existing method
        testSessionService.createOrUpdateFeedback(sessionId, feedbackDto, doctor);

        return ResponseEntity.ok().build();
    }




    // TODO:****************************************

    @GetMapping("/doctors/me")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get logged-in doctor's profile [TODO]")
    public ResponseEntity<DoctorInfoResponse> getMyProfile() {
        throw new NotImplementedException();
    }


    @PutMapping("/doctors/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Update logged-in doctor's profile [TODO]")
    public ResponseEntity<DoctorInfoResponse> updateDoctor(@RequestBody @Valid CreateDoctorRequest request, @PathVariable String id) {
        throw new NotImplementedException();
    }


    @GetMapping("/doctors/{id}")
    @PreAuthorize("hasAnyRole('CLINIC', 'ADMIN')")
    @Operation(summary = "Get doctor by ID [TODO]")
    public ResponseEntity<DoctorInfoResponse> getDoctorById(@PathVariable Long id) {
        throw new NotImplementedException();
    }


    @DeleteMapping("/doctors/{id}")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(summary = "Delete doctor [TODO]")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        throw new NotImplementedException();
    }








}
