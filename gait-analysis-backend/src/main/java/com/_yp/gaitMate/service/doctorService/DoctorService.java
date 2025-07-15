package com._yp.gaitMate.service.doctorService;

import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.dto.page.PageResponseDto;
import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DoctorService {
    DoctorInfoResponse createDoctor(CreateDoctorRequest request);

    PageResponseDto<DoctorInfoResponse> getDoctorsOfLoggedInClinic(Pageable pageable);
}
