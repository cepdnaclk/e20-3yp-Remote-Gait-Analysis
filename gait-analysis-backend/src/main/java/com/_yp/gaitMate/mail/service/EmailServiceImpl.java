package com._yp.gaitMate.mail.service;

import com._yp.gaitMate.security.model.AccountType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${FRONTEND_BASE_URL}")
    private String frontendUrl;

    @Override
    public void sendInvitationEmail(String toEmail, String invitationToken, AccountType accountType) {
        try {
            String signupUrl = frontendUrl + "/signup?token=" + invitationToken + "&type=" + accountType.getValue();

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Complete Your GaitMate Account Setup");
            helper.setText(buildHtmlContent(signupUrl, toEmail), true); // true indicates HTML content

            mailSender.send(message);
            log.info("✅ Invitation email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send invitation email");
        }
    }

    private String buildHtmlContent(String signupUrl, String toEmail) {
        String htmlTemplate = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to GaitMate</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <!-- Header -->
                    <div style="text-align: center; padding: 40px 20px; color: white;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                            Welcome to GaitMate
                        </h1>
                        <p style="margin: 8px 0 0 0; font-size: 18px; opacity: 0.9;">
                            Your journey to better mobility starts here
                        </p>
                    </div>
                   
                    <!-- Main Content -->
                    <div style="background: white; padding: 40px 30px; border-radius: 12px 12px 0 0; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);">
                        <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                            You're Invited! 🎉
                        </h2>
                        
                        <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                            You've been invited to join <strong>RehabGait</strong>. We're excited to have you on board! 
                            Click the button below to complete your account setup and start your journey.
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="{{SIGNUP_URL}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                                Complete Your Setup
                            </a>
                        </div>
                        
                        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 24px 0;">
                            <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">
                                What's Next?
                            </h3>
                            <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Choose your unique username</li>
                                <li style="margin-bottom: 8px;">Create a secure password</li>
                                <li style="margin-bottom: 8px;">Complete your profile setup</li>
                                <li>Start exploring GaitMate features</li>
                            </ul>
                        </div>
                        
                        <p style="color: #718096; font-size: 14px; margin: 24px 0 0 0; line-height: 1.5;">
                            If you have any questions or need assistance, feel free to reach out to our support team. 
                            We're here to help you every step of the way!
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #2d3748; color: #a0aec0; padding: 24px 30px; text-align: center; border-radius: 0 0 12px 12px;">
                        <p style="margin: 0; font-size: 14px;">
                            Best regards,<br>
                            <strong style="color: white;">The GaitMate Team</strong>
                        </p>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #4a5568;">
                            <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                                This invitation was sent to {{TO_EMAIL}}<br>
                                If you didn't expect this invitation, you can safely ignore this email.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """;

        return htmlTemplate.replace("{{SIGNUP_URL}}", signupUrl)
                .replace("{{TO_EMAIL}}", toEmail);
    }
}