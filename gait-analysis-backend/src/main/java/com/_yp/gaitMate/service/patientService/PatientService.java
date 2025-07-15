package com._yp.gaitMate.service.patientService;

import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.patient.CreatePatientRequest;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientService {
    PatientInfoResponse createPatient(@Valid CreatePatientRequest request);

    PageResponseDto<PatientInfoResponse> getPatientsOfLoggedInDoctor(Pageable pageable);

    PageResponseDto<PatientInfoResponse> getPatientsOfLoggedInClinic(Pageable pageable);

    PatientInfoResponse getMyPatientProfile();
}
