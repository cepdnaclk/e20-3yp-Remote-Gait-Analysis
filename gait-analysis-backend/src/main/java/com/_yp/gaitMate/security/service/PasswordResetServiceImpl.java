package com._yp.gaitMate.security.service;

import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.mail.service.EmailService;
import com._yp.gaitMate.security.model.PasswordResetToken;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.repository.PasswordResetTokenRepository;
import com._yp.gaitMate.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetServiceImpl implements PasswordResetService {

     private final UserRepository userRepository;
     private final PasswordResetTokenRepository tokenRepository;
     private final EmailService emailService;
     private final PasswordEncoder passwordEncoder;

     @Transactional
    public void sendPasswordResetEmail(String email) {
        log.info("Sending password reset email to: {}", email);

        // 1. Find user by email (if not found, still return success for security)
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists - just log and return
            log.info("Password reset requested for non-existent email: {}", email);
            return;
        }

        User user = userOpt.get();

        // Clean up any existing tokens for this user first
        tokenRepository.deleteByUser(user);

        // 2. Generate secure token
        String token = generateSecureToken();

        // 3. Save token to database
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.save(resetToken);

        // 4. Send email with reset link
        emailService.sendPasswordResetEmail(user.getEmail(), token);

    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Attempting to reset password with token: {}", token);

        // 1. Find token in database
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            throw new ApiException("Invalid reset token");
        }

        PasswordResetToken resetToken = tokenOpt.get();


        // 2. Check if token is valid ( not expired)
        if (!resetToken.isValid()) {
            throw new ApiException("Reset token has expired");
        }

        // 3. Get user from token
        User user = resetToken.getUser();

        // 4. Update user's password (encoded)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 5. Delete all tokens for this user (better security)
        tokenRepository.delete(resetToken);

        // For now, throw exception to test the flow
        log.info("Password successfully reset for user: {}", user.getEmail());
    }


    private String generateSecureToken() {
        // Generate a random UUID as token (simple and secure)
        return UUID.randomUUID().toString();
    }
}