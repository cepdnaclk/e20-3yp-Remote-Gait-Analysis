package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Clinic;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, Long> {
    Boolean existsByName(String name);

    Optional<Clinic> findByUser_UserId(Long userId);

    Optional<Clinic> findByInvitationToken(String token);

    boolean existsByEmail(String email);
}