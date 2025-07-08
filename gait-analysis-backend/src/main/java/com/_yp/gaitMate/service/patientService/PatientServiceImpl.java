package com._yp.gaitMate.service.patientService;

import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.patient.CreatePatientRequest;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.mapper.PageMapper;
import com._yp.gaitMate.mapper.PatientMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.model.Doctor;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.SensorKit;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.repository.DoctorRepository;
import com._yp.gaitMate.repository.PatientRepository;
import com._yp.gaitMate.repository.SensorKitRepository;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService{
    private final AuthUtil authUtil;
    private final ClinicRepository clinicRepository;
    private final DoctorRepository doctorRepository;
    private final AuthenticationService authService;
    private final SensorKitRepository sensorKitRepository;
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final PageMapper pageMapper;

    @Transactional
    @Override
    public PatientInfoResponse createPatient(CreatePatientRequest request) {

        // Check if the patient name is already used
        if (patientRepository.existsByName(request.getName())) {
            throw new ApiException("Patient name already exists");
        }
        // Check if the patient nic is already used
        if (patientRepository.existsByNic(request.getNic())) {
            throw new ApiException("NIC already exists");
        }

        // check whether the logged-in user is a clinic
        Long userId = authUtil.loggedInUserId();

        Clinic clinic = clinicRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "userId", userId));

        // check whether the provided doctorId is in the clinic
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));

        if (!doctor.getClinic().getId().equals(clinic.getId())) {
            throw new ApiException("Selected doctor does not belong to your clinic");
        }

        // check whether the provided sensorKitId belongs to the clinic and has the status of available
        SensorKit sensorKit = sensorKitRepository.findById(request.getSensorKitId())
                .orElseThrow(() -> new ResourceNotFoundException("SensorKit", "id", request.getSensorKitId()));

        if (sensorKit.getClinic()==null || !sensorKit.getClinic().getId().equals(clinic.getId())) {
            throw new ApiException("Selected sensor kit is not registered under your clinic");
        }
        if (!sensorKit.getStatus().equals(SensorKit.Status.AVAILABLE)) {
            throw new ApiException("Sensor kit is "+ sensorKit.getStatus().name());
        }


        // create the user account for the patient
        SignupRequest signup = SignupRequest.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .roles(Set.of(AppRole.ROLE_PATIENT.name()))
                .build();

        User user = authService.registerUser(signup);

        // attach the patient with - user, clinic, doctor
        Patient patient = Patient.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .age(request.getAge())
                .nic(request.getNic())
                .height(request.getHeight())
                .weight(request.getWeight())
                .gender(Patient.Gender.valueOf(request.getGender().toUpperCase())) // TODO: IllegalArgumentException
                .createdAt(LocalDateTime.now())
                .clinic(clinic)
                .doctor(doctor)
                .sensorKit(sensorKit)
                .user(user)
                .build();

        patient = patientRepository.save(patient);

        sensorKit.setStatus(SensorKit.Status.IN_USE);
        sensorKitRepository.save(sensorKit);
        //TODO:
        // consider the bidirectional nature as well
        // 6. Update sensor kit with patient reference (optional, bidirectional safety)
        // sensorKit.setPatient(patient);

        return patientMapper.toPatientInfoResponse(patient);
    }

    @Override
    public PageResponseDto<PatientInfoResponse> getPatientsOfLoggedInDoctor(Pageable pageable) {
        Doctor doctor = authUtil.getLoggedInDoctor();
        Page<Patient> patients = patientRepository.findByDoctor(doctor, pageable );

        Page<PatientInfoResponse> response = patients.map(patientMapper::toPatientInfoResponse);


//        List<PatientInfoResponse> response = patients.stream()
//                .map(patientMapper::toPatientInfoResponse)
//                .toList();

        return pageMapper.toPageResponse(response);
    }


    @Override
    public List<PatientInfoResponse> getPatientsOfLoggedInClinic() {
        Clinic clinic = authUtil.getLoggedInClinic();
        List<Patient> patients = patientRepository.findByClinic(clinic);

        List<PatientInfoResponse> response = patients.stream()
                .map(patientMapper::toPatientInfoResponse)
                .toList();

        return response;
    }

    @Override
    public PatientInfoResponse getMyPatientProfile() {
        Patient patient = authUtil.getLoggedInPatient();

        PatientInfoResponse patientInfoResponse = patientMapper.toPatientInfoResponse(patient);
        return patientInfoResponse;
    }


    //*********************** P R I V A T E  M E T H O D S ************************************


}
