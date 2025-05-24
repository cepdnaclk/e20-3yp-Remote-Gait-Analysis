package com._yp.gaitMate.service.doctorService;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.mapper.DoctorMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.repository.DoctorRepository;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService{
    private final DoctorRepository doctorRepository;
    private final AuthenticationService authService;
    private final DoctorMapper doctorMapper;
    private final AuthUtil authUtil;

    @Override
    @Transactional
    public DoctorInfoResponse createDoctor(CreateDoctorRequest request) {
        // Check if doctor name is already used
        if (doctorRepository.existsByName(request.getName())) {
            throw new ApiException("Doctor name already exists");
        }

        Clinic clinic = authUtil.getLoggedInClinic();

        // register a user with ROLE_DOCTOR
        SignupRequest signup = SignupRequest.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .roles(Set.of(AppRole.ROLE_DOCTOR.name()))
                .build();

        User user = authService.registerUser(signup);


        // Create doctor entity
        // attach the Doctor with user and clinic
        Doctor doctor = Doctor.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .specialization(request.getSpecialization())
                .createdAt(LocalDateTime.now())
                .clinic(clinic)
                .user(user)
                .build();

        // save doctor
        doctor = doctorRepository.save(doctor);
        return doctorMapper.toDoctorInfoResponse(doctor);
    }



    @Override
    public List<DoctorInfoResponse> getDoctorsOfLoggedInClinic() {
        Clinic clinic = authUtil.getLoggedInClinic();

        List<Doctor> doctors = doctorRepository.findByClinic(clinic);

        return doctors.stream()
                .map(doctorMapper::toDoctorInfoResponse)
                .toList();
    }


    //*********************** P R I V A T E  M E T H O D S ************************************




}
