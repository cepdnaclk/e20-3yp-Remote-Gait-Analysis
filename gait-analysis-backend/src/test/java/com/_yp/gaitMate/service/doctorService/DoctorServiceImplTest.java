package com._yp.gaitMate.service.doctorService;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.mapper.DoctorMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.repository.DoctorRepository;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoctorServiceImplTest {

    @InjectMocks
    private DoctorServiceImpl doctorService;

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private AuthenticationService authService;

    @Mock
    private DoctorMapper doctorMapper;

    @Mock
    private AuthUtil authUtil;

    private CreateDoctorRequest request;
    private Clinic clinic;
    private User clinic_user;
    private User doctor_user;
    private Doctor doctor;
    private DoctorInfoResponse doctorResponse;

    @BeforeEach
    void setUp() {
        request = CreateDoctorRequest.builder()
                .name("Dr. John Smith")
                .email("john@example.com")
                .phoneNumber("0771112222")
                .specialization("Orthopedics")
                .username("drjohn")
                .password("securepass")
                .build();

        clinic_user = new User();
        doctor_user = new User();

        clinic = Clinic.builder()
                .id(1L)
                .name("Sunrise Clinic")
                .user(clinic_user)
                .build();

        doctor = Doctor.builder()
                .id(10L)
                .name("Dr. John Smith")
                .email("john@example.com")
                .phoneNumber("0771112222")
                .specialization("Orthopedics")
                .clinic(clinic)
                .user(doctor_user)
                .createdAt(LocalDateTime.now())
                .build();

        doctorResponse = DoctorInfoResponse.builder()
                .id(10L)
                .name("Dr. John Smith")
                .email("john@example.com")
                .phoneNumber("0771112222")
                .specialization("Orthopedics")
                .createdAt("2025-04-27T10:00:00")
                .build();
    }

    @Nested
    @DisplayName("createDoctor()")
    class CreateDoctorTests {

        @Test
        @DisplayName("Should save doctor and return mapped response")
        void shouldCreateDoctor_andReturnResponse() {
            // Arrange
            when(doctorRepository.existsByName(request.getName())).thenReturn(false);
            when(authUtil.loggedInUserId()).thenReturn(99L);
            when(clinicRepository.findByUser_UserId(99L)).thenReturn(Optional.of(clinic));
            when(authService.registerUser(any(SignupRequest.class))).thenReturn(doctor_user);
            when(doctorRepository.save(any(Doctor.class))).thenReturn(doctor);
            when(doctorMapper.toDoctorInfoResponse(any(Doctor.class))).thenReturn(doctorResponse);

            // Act
            DoctorInfoResponse result = doctorService.createDoctor(request);

            // Assert
            assertNotNull(result);
            assertEquals("Dr. John Smith", result.getName());
            assertEquals("john@example.com", result.getEmail());

            // Verify
            verify(doctorRepository).existsByName(request.getName());
            verify(clinicRepository).findByUser_UserId(99L);
            verify(authService).registerUser(any(SignupRequest.class));
            verify(doctorRepository).save(any(Doctor.class));
            verify(doctorMapper).toDoctorInfoResponse(any(Doctor.class));
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when clinic not found")
        void shouldThrow_whenClinicNotFound() {
            // Arrange
            when(doctorRepository.existsByName(request.getName())).thenReturn(false);
            when(authUtil.loggedInUserId()).thenReturn(99L);
            when(clinicRepository.findByUser_UserId(99L)).thenReturn(Optional.empty());

            // Act + Assert
            ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                    () -> doctorService.createDoctor(request));

            assertTrue(ex.getMessage().contains("Clinic not found with userId: 99"));

            // Verify
            verify(clinicRepository).findByUser_UserId(99L);
            verifyNoInteractions(authService, doctorMapper);
            verify(doctorRepository, never()).save(any(Doctor.class));
        }
    }
}
