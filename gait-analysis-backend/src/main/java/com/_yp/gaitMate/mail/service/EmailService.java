package com._yp.gaitMate.mail.service;

import com._yp.gaitMate.security.model.AccountType;

public interface EmailService {
    void sendInvitationEmail(String toEmail, String invitationToken,  AccountType accountType);
}
