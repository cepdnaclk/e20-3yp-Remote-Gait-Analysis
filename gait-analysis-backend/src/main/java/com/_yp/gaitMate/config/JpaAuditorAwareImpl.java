package com._yp.gaitMate.config;

import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorProvider")
@RequiredArgsConstructor
public class JpaAuditorAwareImpl implements AuditorAware<String> {

    private final AuthUtil authUtil;

    @Override
    @NonNull
    public Optional<String> getCurrentAuditor() {
        try {
            return Optional.ofNullable(authUtil.loggedInUsername());
        } catch (Exception e) {
            // For unauthenticated contexts (e.g., tests, background jobs)
            return Optional.empty();
        }
    }
}
