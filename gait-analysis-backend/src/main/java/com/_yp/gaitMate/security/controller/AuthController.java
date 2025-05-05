package com._yp.gaitMate.security.controller;

import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping("/signin")

    @Operation(
            summary = "Authenticate an existing user" ,
            description = "Allows the user to log in with user name and password and returns a JWT token and user information",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Unauthorized",
                            responseCode = "401"
                    )
            }
    )
//    @RequestBody(description = "User name and the password of the user" , required = true)
    public ResponseEntity<UserInfoResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        UserInfoResponse response = authenticationService.authenticateUser(loginRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/signup")
    @Operation(summary = "SignUp", description = "Create a new user")
//    @RequestBody(description = "Data transfer object for Signing up", required = true)
    public ResponseEntity<UserInfoResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest){
        UserInfoResponse response = authenticationService.registerUser(signupRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    @Operation(summary = "Get User Information" , description = "Retrieve information about the user")
    public ResponseEntity<UserInfoResponse> getUserDetails(Authentication authentication){
        UserInfoResponse response = authenticationService.getUserDetails(authentication);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
