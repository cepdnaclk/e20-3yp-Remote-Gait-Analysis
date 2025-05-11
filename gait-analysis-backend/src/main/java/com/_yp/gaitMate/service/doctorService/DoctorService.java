package com._yp.gaitMate.service.doctorService;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;

public interface DoctorService {
    DoctorInfoResponse createDoctor(CreateDoctorRequest request);
}
