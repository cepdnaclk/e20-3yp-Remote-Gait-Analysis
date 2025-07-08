package com._yp.gaitMate.mail.service;


import com._yp.gaitMate.security.model.AccountType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${FRONTEND_BASE_URL}")
    private String frontendUrl;

    @Override
    public void sendInvitationEmail(String toEmail, String invitationToken,  AccountType accountType) {
        try {
            // URL with token, email, and type
            String signupUrl = frontendUrl + "/signup?token=" + invitationToken + "&type=" + accountType.getValue();


            SimpleMailMessage message = getMailMessage(toEmail, signupUrl);

            mailSender.send(message);
            log.info("✅ Invitation email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send invitation email");
        }
    }


    private static SimpleMailMessage getMailMessage(String toEmail, String signupUrl) {
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
        return message;
    }
}