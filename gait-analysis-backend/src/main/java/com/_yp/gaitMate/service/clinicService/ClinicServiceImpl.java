package com._yp.gaitMate.service.clinicService;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse; // ✅ import DTO
import com._yp.gaitMate.mapper.DoctorMapper;       // ✅ import mapper
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.repository.DoctorRepository; // ✅ import repo

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.mapper.ClinicMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.repository.ClinicRepository;

import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Service class for managing clinic-related operations.
 */
@Service
@RequiredArgsConstructor
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;
    private final AuthenticationService authService;
    private final ClinicMapper clinicMapper;
    private final AuthUtil authUtil;

    // ✅ Inject missing beans
    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    @Override
    @Transactional
    public ClinicInfoResponse createClinic(CreateClinicRequest clinicRequest) {
        // Check if clinic name is already used
        if (clinicRepository.existsByName(clinicRequest.getName())) {
            throw new ApiException("Clinic name already exists");
        }

        // 1. Register user with ROLE_CLINIC using authService
        SignupRequest signupRequest = SignupRequest.builder()
                .username(clinicRequest.getUsername())
                .password(clinicRequest.getPassword())
                .email(clinicRequest.getEmail())
                .roles(Set.of(AppRole.ROLE_CLINIC.name()))
                .build();

        User user = authService.registerUser(signupRequest);

        // 2. Create and save clinic
        Clinic clinic = Clinic.builder()
                .name(clinicRequest.getName())
                .email(clinicRequest.getEmail())
                .phoneNumber(clinicRequest.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        clinic = clinicRepository.save(clinic);

        return clinicMapper.toClinicInfoResponse(clinic);
    }

    @Override
    public ClinicInfoResponse getClinicById(Long id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "id", id));

        return clinicMapper.toClinicInfoResponse(clinic);
    }

    @Override
    public ClinicInfoResponse getMyClinicProfile() {
        Long userId = authUtil.loggedInUserId();

        Clinic clinic = clinicRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "userId", userId));

        return clinicMapper.toClinicInfoResponse(clinic);
    }


    @Override
    public List<ClinicInfoResponse> getAllClinics() {
        return clinicRepository.findAll().stream()
                .map(clinicMapper::toClinicInfoResponse)
                .toList();
    }
}

