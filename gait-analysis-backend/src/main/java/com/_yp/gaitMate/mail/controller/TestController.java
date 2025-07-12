package com._yp.gaitMate.mail.controller;

import com._yp.gaitMate.mail.service.EmailService;
import com._yp.gaitMate.security.model.AccountType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/test")
@RequiredArgsConstructor
@Slf4j
public class TestController {

    private final EmailService emailService;

    @GetMapping("/send-email")
    public String testEmail(@RequestParam String email) {
        try {
            String testUrl = "http://localhost:3000/signup?token=test-123&email=" + email;
            emailService.sendInvitationEmail(email, testUrl, AccountType.CLINIC);

            log.info("🧪 Test email sent successfully!");
            return "✅ Email sent successfully to " + email;

        } catch (Exception e) {
            log.error("❌ Test email failed: {}", e.getMessage());
            return "❌ Email failed: " + e.getMessage();
        }
    }
}
