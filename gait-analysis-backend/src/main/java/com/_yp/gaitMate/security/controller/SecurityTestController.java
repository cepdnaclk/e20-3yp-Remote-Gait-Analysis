package com._yp.gaitMate.security.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SecurityTestController {

    @GetMapping("/public/test")
    public ResponseEntity<String> checkPublicEndpoint(){
        return ResponseEntity.ok("Public endpoint works");
    }

    @GetMapping("/clinic/test")
    public ResponseEntity<String> checkClinicEndpoint(){
        return ResponseEntity.ok("Clinic endpoint works");
    }

    @GetMapping("/patient/test")
    public ResponseEntity<String> checkPatientEndpoint(){
        return ResponseEntity.ok("Patient endpoint works");
    }

    @GetMapping("/admin/test")
    public ResponseEntity<String> checkAdminEndpoint(){
        return ResponseEntity.ok("Admin endpoint works");
    }

    @GetMapping("/doctor/test")
    public ResponseEntity<String> checkDoctorEndpoint(){
        return ResponseEntity.ok("Doctor endpoint works");
    }
}
