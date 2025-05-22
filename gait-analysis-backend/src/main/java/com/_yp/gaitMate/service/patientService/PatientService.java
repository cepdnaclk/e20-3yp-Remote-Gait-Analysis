package com._yp.gaitMate.service.patientService;

import com._yp.gaitMate.dto.patient.CreatePatientRequest;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface PatientService {
    PatientInfoResponse createPatient(@Valid CreatePatientRequest request);

    List<PatientInfoResponse> getPatientsOfLoggedInDoctor();

    List<PatientInfoResponse> getPatientsOfLoggedInClinic();
}
