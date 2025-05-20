package com._yp.gaitMate.controller;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.service.clinicService.ClinicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
//@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    public ClinicController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @PostMapping("/clinics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Register a new clinic (Admin only)",
            description = "Creates a new clinic with associated user account. Accessible only to admins.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Clinic created successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ClinicInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 3,\n" +
                                                    "  \"name\": \"New Horizon Rehab\",\n" +
                                                    "  \"email\": \"admin@newhorizon.lk\",\n" +
                                                    "  \"phoneNumber\": \"0756781234\",\n" +
                                                    "  \"createdAt\": \"2025-05-11T21:12:47.890\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input or user already exists",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = com._yp.gaitMate.dto.ApiResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"message\": \"User with email already exists\",\n" +
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
                                                    "  \"timestamp\": \"2025-05-11T18:33:20.671+00:00\",\n" +
                                                    "  \"status\": 403,\n" +
                                                    "  \"error\": \"Forbidden\",\n" +
                                                    "  \"path\": \"/api/clinics\"\n" +
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
                                                    "  \"path\": \"/api/clinics\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Full authentication is required to access this resource\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<ClinicInfoResponse> createClinic(
            @RequestBody @Valid CreateClinicRequest request) {
        ClinicInfoResponse response = clinicService.createClinic(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/clinics/{id}")
    @Operation(
            summary = "Get clinic by ID (Any authenticated user)",
            description = "Returns details of a clinic by its ID. Authenticated user with any role can use this endpoint",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Clinic found",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ClinicInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 1,\n" +
                                                    "  \"name\": \"Central Physiotherapy Clinic\",\n" +
                                                    "  \"email\": \"contact@centralclinic.com\",\n" +
                                                    "  \"phoneNumber\": \"0712345678\",\n" +
                                                    "  \"createdAt\": \"2025-05-11T20:46:31.123\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Clinic not found",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = com._yp.gaitMate.dto.ApiResponse.class),
                                    examples = @ExampleObject(
                                            value = "{ \"message\": \"Clinic not found with id: 3\", \"status\": false }"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            value = "{ \"status\": 401, \"error\": \"Unauthorized\", \"message\": \"Full authentication is required to access this resource\", \"path\": \"/api/clinics/3\" }"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<ClinicInfoResponse> getClinicById(@PathVariable Long id) {
        ClinicInfoResponse response = clinicService.getClinicById(id);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/clinics/me")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(
            summary = "Get the logged-in clinic's own profile (Logged in clinic only)",
            description = "Returns the profile details of the currently authenticated clinic.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Clinic profile retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ClinicInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 1,\n" +
                                                    "  \"name\": \"Central Physiotherapy Clinic\",\n" +
                                                    "  \"email\": \"contact@centralclinic.com\",\n" +
                                                    "  \"phoneNumber\": \"0712345678\",\n" +
                                                    "  \"createdAt\": \"2025-05-11T20:46:31.123\"\n" +
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
                                                    "  \"path\": \"/api/clinics/me\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Full authentication is required to access this resource\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"timestamp\": \"2025-05-11T18:05:31.971+00:00\",\n" +
                                                    "  \"status\": 403,\n" +
                                                    "  \"error\": \"Forbidden\",\n" +
                                                    "  \"path\": \"/api/clinics/me\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<ClinicInfoResponse> getMyClinicProfile() {
        ClinicInfoResponse response = clinicService.getMyClinicProfile();
        return ResponseEntity.ok(response);
    }


    @GetMapping("/clinics")
    @Operation(
            summary = "Get all clinics (Any authenticated user)",
            description = "Returns a list of all registered clinics. Accessible to any authenticated user.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "List of clinics returned",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ClinicInfoResponse.class)),
                                    examples = @ExampleObject(
                                            value = "[\n" +
                                                    "  {\n" +
                                                    "    \"id\": 1,\n" +
                                                    "    \"name\": \"Central Physiotherapy Clinic\",\n" +
                                                    "    \"email\": \"contact@centralclinic.com\",\n" +
                                                    "    \"phoneNumber\": \"0712345678\",\n" +
                                                    "    \"createdAt\": \"2025-05-11T20:46:31.123\"\n" +
                                                    "  },\n" +
                                                    "  {\n" +
                                                    "    \"id\": 2,\n" +
                                                    "    \"name\": \"Westend Therapy Center\",\n" +
                                                    "    \"email\": \"info@westendtherapy.lk\",\n" +
                                                    "    \"phoneNumber\": \"0776543210\",\n" +
                                                    "    \"createdAt\": \"2025-04-02T15:22:10.456\"\n" +
                                                    "  }\n" +
                                                    "]"
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
                                                    "  \"path\": \"/api/clinics\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Full authentication is required to access this resource\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<List<ClinicInfoResponse>> getAllClinics() {
        List<ClinicInfoResponse> clinics = clinicService.getAllClinics();
        return ResponseEntity.ok(clinics);
    }

    @GetMapping("/clinics/me/doctors")
    @PreAuthorize("hasRole('CLINIC')")
    public ResponseEntity<List<DoctorInfoResponse>> getMyDoctors() {
        List<DoctorInfoResponse> doctors = clinicService.getDoctorsOfLoggedInClinic();
        return ResponseEntity.ok(doctors);
    }



    // TODO: update, delete

}
