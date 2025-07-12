package com._yp.gaitMate.security.service;

import com._yp.gaitMate.security.dto.InvitationSignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;

public interface InvitationService {
    UserInfoResponse completeInvitationSignup(InvitationSignupRequest request);
}
