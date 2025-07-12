package com._yp.gaitMate.security.service;

import org.springframework.transaction.annotation.Transactional;

public interface PasswordResetService {
    void sendPasswordResetEmail(String email);
    void resetPassword(String token, String newPassword);
}
