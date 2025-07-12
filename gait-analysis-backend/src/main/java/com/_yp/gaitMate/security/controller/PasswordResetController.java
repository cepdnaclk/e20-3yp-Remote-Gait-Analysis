package com._yp.gaitMate.security.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.security.dto.ForgotPasswordRequest;
import com._yp.gaitMate.security.dto.ResetPasswordRequest;
import com._yp.gaitMate.security.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;
    /*
    Here we are going to have two endpoints

    1. FORGOT PASSWORD REQUEST
        - a post request containing the email address
        - this calls the service method to send an email with a token attached link to the reset password page

    2. RESET PASSWORD REQUEST
        - a post request containing the new password
        - this calls the service method to validate the token and reset the password
     */

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request){
        log.info("Password reset requested for email: {}", request.getEmail());
        passwordResetService.sendPasswordResetEmail(request.getEmail());

        ApiResponse response = new ApiResponse("Check your email inbox!", true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        log.info("Password reset attempted with token: {}", request.getToken());

        // Call service to reset password
         passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

        ApiResponse response = new ApiResponse("Password has been reset successfully.", true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
