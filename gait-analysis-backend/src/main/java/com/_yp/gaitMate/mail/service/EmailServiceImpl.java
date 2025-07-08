package com._yp.gaitMate.mail.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendInvitationEmail(String toEmail, String signupUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Complete Your GaitMate Account Setup");
            message.setText(
                    "Hi there!\n\n" +
                            "You've been invited to join GaitMate. Click the link below to complete your account setup:\n\n" +
                            signupUrl + "\n\n" +
                            "Complete your registration by choosing a username and password.\n\n" +
                            "Thanks!"
            );

            mailSender.send(message);
            log.info("✅ Invitation email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send invitation email");
        }
    }
}