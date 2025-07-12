package com._yp.gaitMate.security.service;

import com._yp.gaitMate.security.dto.InvitationSignupRequest;
import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

public interface AuthenticationService {
    UserInfoResponse authenticateUser(LoginRequest loginRequest);

    UserInfoResponse registerUserAndLogin(SignupRequest signupRequest);
    User registerUser(SignupRequest signupRequest);
    UserInfoResponse getUserDetails(Authentication authentication);
    UserInfoResponse completeInvitationSignup(InvitationSignupRequest request);
}
