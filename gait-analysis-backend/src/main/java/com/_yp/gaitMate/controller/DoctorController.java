package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.service.doctorService.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(
            summary = "Register a new doctor (Clinic only)",
            description = "Allows a logged-in clinic to create a doctor account under their clinic.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Doctor created successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input or username/email already exists"),
                    @ApiResponse(responseCode = "403", description = "Access denied (Forbidden)"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<DoctorInfoResponse> createDoctor(@RequestBody @Valid CreateDoctorRequest request) {
        DoctorInfoResponse response = doctorService.createDoctor(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
