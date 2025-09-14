package com._yp.gaitMate.service.clinicService;
import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.mail.service.EmailService;
import com._yp.gaitMate.mapper.DoctorMapper;       // ✅ import mapper
import com._yp.gaitMate.mapper.PageMapper;
import com._yp.gaitMate.repository.DoctorRepository; // ✅ import repo

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.mapper.ClinicMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.repository.ClinicRepository;

import com._yp.gaitMate.security.model.AccountStatus;
import com._yp.gaitMate.security.model.AccountType;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service class for managing clinic-related operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;
    private final AuthenticationService authService;
    private final ClinicMapper clinicMapper;
    private final AuthUtil authUtil;
    private final EmailService emailService;
    private final PageMapper pageMapper;


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

        if (clinicRepository.existsByEmail(clinicRequest.getEmail())) {
            throw new ApiException("Email is already taken");
        }


        /* DEPRECATED
        // 1. Register user with ROLE_CLINIC using authService
        SignupRequest signupRequest = SignupRequest.builder()
                .username(clinicRequest.getUsername())
                .password(clinicRequest.getPassword())
                .email(clinicRequest.getEmail())
                .roles(Set.of(AppRole.ROLE_CLINIC.name()))
                .build();

        User user = authService.registerUser(signupRequest);
         */

        // ✅ Generate invitation token
        String invitationToken = UUID.randomUUID().toString();



        // 2. Create and save clinic WITHOUT user (user will be created later)
        Clinic clinic = Clinic.builder()
                .name(clinicRequest.getName())
                .email(clinicRequest.getEmail())
                .phoneNumber(clinicRequest.getPhoneNumber())
                .createdAt(LocalDateTime.now())
                .invitationToken(invitationToken)
                .accountStatus(AccountStatus.INVITATION_SENT)
                .user(null)  // No user yet!
                .build();

        clinic = clinicRepository.save(clinic);

        // Send invitation email
        emailService.sendInvitationEmail(clinicRequest.getEmail(), invitationToken, AccountType.CLINIC);

        log.info("🏥 Clinic '{}' created successfully. Invitation sent to: {}",
                clinicRequest.getName(), clinicRequest.getEmail());

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


//    @Override
//    public List<ClinicInfoResponse> getAllClinics() {
//        return clinicRepository.findAll().stream()
//                .map(clinicMapper::toClinicInfoResponse)
//                .toList();
//    }

    @Override
    public PageResponseDto<ClinicInfoResponse> getAllClinics(Pageable pageable) {
        Page<Clinic> clinicPage = clinicRepository.findAll(pageable);
        Page<ClinicInfoResponse> responsePage = clinicPage.map(clinicMapper::toClinicInfoResponse);
        return pageMapper.toPageResponse(responsePage);
    }

}

