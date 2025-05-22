package com._yp.gaitMate.service.doctorService;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;

import java.util.List;

public interface DoctorService {
    DoctorInfoResponse createDoctor(CreateDoctorRequest request);

    List<DoctorInfoResponse> getDoctorsOfLoggedInClinic();
}
