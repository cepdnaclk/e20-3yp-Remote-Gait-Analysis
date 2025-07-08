package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.patient.CreatePatientRequest;
import com._yp.gaitMate.dto.patient.PatientDashboardStatsDto;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import com._yp.gaitMate.security.utils.AuthUtil;
import com._yp.gaitMate.service.patientDashboardService.PatientDashboardSerivce;
import com._yp.gaitMate.service.patientService.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.mapper.PatientMapper;
import com._yp.gaitMate.exception.ResourceNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepository; // ✅ Add this
    private final PatientMapper patientMapper;
    private final AuthUtil authUtil;
    private final PatientDashboardSerivce patientDashboardSerivce;

    @PostMapping("/patients")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(
            summary = "Register a new patient (Clinic only)",
            description = "Allows a logged-in clinic to register a new patient by assigning them to a doctor and a sensor kit.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Patient created successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PatientInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 1,\n" +
                                                    "  \"name\": \"John Doe2\",\n" +
                                                    "  \"email\": \"john.doe2@example.com\",\n" +
                                                    "  \"phoneNumber\": \"07712345674\",\n" +
                                                    "  \"age\": 30,\n" +
                                                    "  \"height\": 175,\n" +
                                                    "  \"weight\": 70,\n" +
                                                    "  \"gender\": \"MALE\",\n" +
                                                    "  \"createdAt\": \"2025-05-13T18:21:09.150504800\",\n" +
                                                    "  \"doctorId\": 401,\n" +
                                                    "  \"sensorKitId\": 606,\n" +
                                                    "  \"nic\": \"2001311031024\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input or duplicate email/username",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = com._yp.gaitMate.dto.ApiResponse.class),
                                    examples = {
                                            @ExampleObject(
                                                    name = "DuplicateName",
                                                    summary = "Duplicate patient name",
                                                    value = "{\n" +
                                                            "  \"message\": \"Patient name already exists\",\n" +
                                                            "  \"status\": false\n" +
                                                            "}"
                                            ),
                                            @ExampleObject(
                                                    name = "ValidationError",
                                                    summary = "Validation failure (e.g., weight too high)",
                                                    value = "{\n" +
                                                            "  \"message\": \"weight must be less than or equal to 300\"\n" +
                                                            "}"
                                            )
                                    }
                            )
                    ),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Access denied (Forbidden)",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"timestamp\": \"2025-05-13T12:53:52.776+00:00\",\n" +
                                                    "  \"status\": 403,\n" +
                                                    "  \"error\": \"Forbidden\",\n" +
                                                    "  \"path\": \"/api/patients\"\n" +
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
                                                    "  \"path\": \"/api/patients\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Full authentication is required to access this resource\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<PatientInfoResponse> createPatient(@RequestBody @Valid CreatePatientRequest request) {
        PatientInfoResponse response = patientService.createPatient(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("patients/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'CLINIC', 'ADMIN')")
    public ResponseEntity<PatientInfoResponse> getPatientById(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        return ResponseEntity.ok(patientMapper.toPatientInfoResponse(patient));
    }


    @GetMapping("/clinics/me/patients")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(summary = "Get the logged in clinic's patients")
    public ResponseEntity<List<PatientInfoResponse>> getPatientsOfLoggedInClinic() {

        List<PatientInfoResponse> patients = patientService.getPatientsOfLoggedInClinic();

        return ResponseEntity.ok(patients);
    }

    @GetMapping("patients/me")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Get the logged in patient's patient profile [TODO]")
    public ResponseEntity<PatientInfoResponse> getMyPatientProfile(){
        PatientInfoResponse response = patientService.getMyPatientProfile();
        return ResponseEntity.ok(response);
    }


    @GetMapping("/patients/me/dashboard-stats")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientDashboardStatsDto> getDashboardStatsOfLoggedInPatient(){

        Patient patient = authUtil.getLoggedInPatient();
        PatientDashboardStatsDto stats = patientDashboardSerivce.getDashboardStatsForCurrentPatient();
        return ResponseEntity.ok(stats);
    }





    // TODO:
    @DeleteMapping("patients/{id}")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(summary = "Delete patient from the clinic [TODO]")
    public ResponseEntity<?> deletePatient(@PathVariable Long id){
        throw new NotImplementedException();
    }

    // TODO:
    @PutMapping("patients/{id}")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(summary = "Update patient details [TODO]")
    public ResponseEntity<PatientInfoResponse> updatePatient(@PathVariable Long id, @RequestBody @Valid CreatePatientRequest request) {
        throw new NotImplementedException();

    }

}
