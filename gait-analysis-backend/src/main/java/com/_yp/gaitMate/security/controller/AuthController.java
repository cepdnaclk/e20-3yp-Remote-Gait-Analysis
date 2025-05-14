package com._yp.gaitMate.security.controller;

import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
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
            summary = "Authenticate an existing user",
            description = "Allows the user to log in with username and password and returns a JWT token and user information",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Success",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 3,\n" +
                                                    "  \"jwtToken\": \"<jwt-token>\",\n" +
                                                    "  \"email\": \"admin1@example.com\",\n" +
                                                    "  \"username\": \"admin1\",\n" +
                                                    "  \"roles\": [\n" +
                                                    "    \"ROLE_ADMIN\"\n" +
                                                    "  ]\n" +
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
                                                    "  \"path\": \"/api/auth/signin\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Bad credentials\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<UserInfoResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        UserInfoResponse response = authenticationService.authenticateUser(loginRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    // @PostMapping("/signup")
    // @Operation(summary = "SignUp", description = "Create a new user")
    public ResponseEntity<UserInfoResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest){
        UserInfoResponse response = authenticationService.registerUserAndLogin(signupRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    @Operation(
            summary = "Get User Information of the logged in user (Any authenticated user)",
            description = "Retrieve information about the user",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User information retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserInfoResponse.class),
                                    examples = @ExampleObject(
                                            value = "{\n" +
                                                    "  \"id\": 3,\n" +
                                                    "  \"jwtToken\": \"<jwt-token>\",\n" +
                                                    "  \"email\": \"admin1@example.com\",\n" +
                                                    "  \"username\": \"admin1\",\n" +
                                                    "  \"roles\": [\n" +
                                                    "    \"ROLE_ADMIN\"\n" +
                                                    "  ]\n" +
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
                                                    "  \"path\": \"/api/auth/user\",\n" +
                                                    "  \"error\": \"Unauthorized\",\n" +
                                                    "  \"message\": \"Full authentication is required to access this resource\",\n" +
                                                    "  \"status\": 401\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<UserInfoResponse> getUserDetails(Authentication authentication){
        UserInfoResponse response = authenticationService.getUserDetails(authentication);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
