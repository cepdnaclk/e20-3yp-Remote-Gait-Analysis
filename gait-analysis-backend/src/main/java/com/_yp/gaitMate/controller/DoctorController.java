package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.service.doctorService.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/")
//@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

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
}
