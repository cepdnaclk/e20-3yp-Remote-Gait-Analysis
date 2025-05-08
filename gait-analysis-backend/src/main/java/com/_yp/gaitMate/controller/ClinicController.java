package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.service.clinicService.ClinicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    @PostMapping("/clinics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Register a new clinic (Admin only)",
            description = "Creates a new clinic with associated user account. Accessible only to admins.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Clinic created successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input or user already exists"),
                    @ApiResponse(responseCode = "403", description = "Access denied (Forbidden)"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<ClinicInfoResponse> createClinic(@RequestBody @Valid CreateClinicRequest request) {
        ClinicInfoResponse response = clinicService.createClinic(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/clinics/{id}")
    @Operation(
            summary = "Get clinic by ID",
            description = "Returns details of a clinic by its ID. Authenticated user with any role can use this endpoint",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Clinic found"),
                    @ApiResponse(responseCode = "404", description = "Clinic not found"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<ClinicInfoResponse> getClinicById(@PathVariable Long id) {
        ClinicInfoResponse response = clinicService.getClinicById(id);
        return ResponseEntity.ok(response);
    }
}
