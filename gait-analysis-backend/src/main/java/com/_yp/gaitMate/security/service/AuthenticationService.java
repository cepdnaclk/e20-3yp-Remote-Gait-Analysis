package com._yp.gaitMate.security.service;

import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

public interface AuthenticationService {
    UserInfoResponse authenticateUser(LoginRequest loginRequest);

    UserInfoResponse registerUser(SignupRequest signupRequest);

    UserInfoResponse getUserDetails(Authentication authentication);
}
