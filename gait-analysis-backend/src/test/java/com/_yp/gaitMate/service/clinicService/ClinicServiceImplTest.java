package com._yp.gaitMate.service.clinicService;


import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.mapper.ClinicMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class ClinicServiceImplTest {

    @InjectMocks
    private ClinicServiceImpl clinicService;

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private AuthenticationService authService;

    @Mock
    private ClinicMapper clinicMapper;

    @Mock
    private AuthUtil authUtil;

    private CreateClinicRequest request;
    private Clinic clinic;
    private ClinicInfoResponse clinicResponse;
    private User dummyUser;

    @BeforeEach
    void setUp() {
        request = CreateClinicRequest.builder()
                .name("Sunrise Clinic")
                .email("clinic@example.com")
                .phoneNumber("0712345678")
                .username("sunrise_user")
                .password("secure123")
                .build();

        dummyUser = new User();

        clinic = Clinic.builder()
                .id(1L)
                .name("Sunrise Clinic")
                .email("clinic@example.com")
                .phoneNumber("0712345678")
                .createdAt(LocalDateTime.now())
                .user(dummyUser)
                .build();

        clinicResponse = ClinicInfoResponse.builder()
                .id(1L)
                .name("Sunrise Clinic")
                .email("clinic@example.com")
                .phoneNumber("0712345678")
                .createdAt("2025-04-27T10:00:00")
                .build();
    }

    @Test
    void createClinic_shouldSaveClinic_andReturnMappedResponse() {
        // Mock behavior
        when(clinicRepository.existsByName(request.getName())).thenReturn(false);
        when(authService.registerUser(any(SignupRequest.class))).thenReturn(dummyUser);
        when(clinicRepository.save(any(Clinic.class))).thenReturn(clinic);
        when(clinicMapper.toClinicInfoResponse(clinic)).thenReturn(clinicResponse);

        // Execute
        ClinicInfoResponse result = clinicService.createClinic(request);

        // Assert
        assertNotNull(result);
        assertEquals("Sunrise Clinic", result.getName());
        assertEquals("clinic@example.com", result.getEmail());

        // Verify interactions
        verify(clinicRepository).existsByName("Sunrise Clinic");
        verify(authService).registerUser(any(SignupRequest.class));
        verify(clinicRepository).save(any(Clinic.class));
        verify(clinicMapper).toClinicInfoResponse(any(Clinic.class));
    }

    @Test
    void createClinic_shouldThrowException_whenClinicNameExists() {
        // Mock behavior
        when(clinicRepository.existsByName(request.getName())).thenReturn(true);

        // Assert
        ApiException exception = assertThrows(ApiException.class, () -> clinicService.createClinic(request));
        assertEquals("Clinic name already exists", exception.getMessage());

        // Verify
        verify(clinicRepository).existsByName("Sunrise Clinic");
        verifyNoInteractions(authService, clinicMapper);
        verify(clinicRepository, never()).save(any(Clinic.class));
    }

    @Test
    void getClinicById_shouldReturnClinic_whenFound() {
        // Mock behavior
        when(clinicRepository.findById(1L)).thenReturn(Optional.of(clinic));
        when(clinicMapper.toClinicInfoResponse(clinic)).thenReturn(clinicResponse);

        // Execute
        ClinicInfoResponse result = clinicService.getClinicById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Sunrise Clinic", result.getName());

        // Verify
        verify(clinicRepository).findById(1L);
        verify(clinicMapper).toClinicInfoResponse(clinic);
    }

    @Test
    void getClinicById_shouldThrowException_whenNotFound() {
        // Mock behavior
        when(clinicRepository.findById(99L)).thenReturn(Optional.empty());

        // Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> clinicService.getClinicById(99L));
        assertEquals("Clinic not found with id: 99", exception.getMessage());

        // Verify
        verify(clinicRepository).findById(99L);
        verifyNoInteractions(clinicMapper);
    }


    // TODO: Test getMyClinc and getAllClinics endpoints
    // TODO: Nest the related tests
}

