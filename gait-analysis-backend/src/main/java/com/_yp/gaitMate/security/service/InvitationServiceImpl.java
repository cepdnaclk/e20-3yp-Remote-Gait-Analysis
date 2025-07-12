package com._yp.gaitMate.security.service;


import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.model.*;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.repository.DoctorRepository;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.security.dto.InvitationSignupRequest;
import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.model.AccountStatus;
import com._yp.gaitMate.security.model.AccountType;
import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.service.AuthenticationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvitationServiceImpl implements InvitationService {

    private final ClinicRepository clinicRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AuthenticationService authenticationService;

    @Override
    @Transactional
    public UserInfoResponse completeInvitationSignup(InvitationSignupRequest request) {

        // ✅ 1. Get essential entity info by token
        EntityInfo entityInfo = findEntityByToken(request.getToken(), request.getAccountType());

        // ✅ 2. Simple validation - no casting needed
        if (entityInfo.hasUserAlready()) {
            throw new ApiException("Account already created for this invitation");
        }

        // ✅ 3. Create user - email from entityInfo
        SignupRequest signupRequest = SignupRequest.builder()
                .username(request.getUsername())
                .email(entityInfo.email)  // ✅ No casting needed!
                .password(request.getPassword())
                .roles(Set.of(entityInfo.role.name()))
                .build();

        User user = authenticationService.registerUser(signupRequest);

        // ✅ 4. Link user to entity
        linkUserToEntity(entityInfo, user);

        log.info("✅ User account created and linked successfully for: {} ({}) - Entity: {}",
                entityInfo.email,
                entityInfo.role.name(),
                entityInfo.entityName);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword(signupRequest.getPassword());
        loginRequest.setUsername(signupRequest.getUsername());

        return authenticationService.authenticateUser(loginRequest);
    }

    private EntityInfo findEntityByToken(String token, String accountType) {
        // Convert string to enum for type-safe comparison
        AccountType type;
        try {
            type = AccountType.valueOf(accountType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid account type: " + accountType);
        }

        switch (type) {
            case CLINIC:
                Clinic clinic = clinicRepository.findByInvitationToken(token)
                        .orElseThrow(() -> new ApiException("Invalid invitation token"));

                return new EntityInfo(
                        clinic.getEmail(),
                        AppRole.ROLE_CLINIC,
                        clinic.getUser() != null,
                        clinic.getName(),
                        clinic  // Keep for linking
                );

            case PATIENT:
                Patient patient = patientRepository.findByInvitationToken(token)
                        .orElseThrow(() -> new ApiException("Invalid invitation token"));

                return new EntityInfo(
                        patient.getEmail(),
                        AppRole.ROLE_PATIENT,
                        patient.getUser() != null,
                        patient.getName(),
                        patient
                );

            case DOCTOR:
                Doctor doctor = doctorRepository.findByInvitationToken(token)
                        .orElseThrow(() -> new ApiException("Invalid invitation token"));

                return new EntityInfo(
                        doctor.getEmail(),
                        AppRole.ROLE_DOCTOR,
                        doctor.getUser() != null,
                        doctor.getName(),
                        doctor
                );

            default:
                throw new ApiException("Unsupported account type: " + type);
        }
    }

    private void linkUserToEntity(EntityInfo entityInfo, User user) {
        Object entity = entityInfo.entity;

        if (entity instanceof Clinic clinic) {
            clinic.setUser(user);
            clinic.setAccountStatus(AccountStatus.ACCOUNT_CREATED);
            clinicRepository.save(clinic);
        } else if (entity instanceof Patient patient) {
            patient.setUser(user);
            patient.setAccountStatus(AccountStatus.ACCOUNT_CREATED);
            patientRepository.save(patient);
        } else if (entity instanceof Doctor doctor) {
            doctor.setUser(user);
            doctor.setAccountStatus(AccountStatus.ACCOUNT_CREATED);
            doctorRepository.save(doctor);
        }
    }

    private UserInfoResponse createUserInfoResponse(User user) {
        UserInfoResponse response = new UserInfoResponse();
        response.setId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setRolesFromSetOfRoles(user.getRoles());
        return response;
    }

    // ✅ Optimized helper class with only essential fields
    private record EntityInfo(
            String email,           // For user creation
            AppRole role,          // For role assignment
            boolean hasUserAlready, // For validation
            String entityName,     // For logging
            Object entity          // For linking (minimal casting)
    ) {}
}
