package com._yp.gaitMate.mail.service;

public interface EmailService {
    void sendInvitationEmail(String toEmail, String signupUrl);
}
