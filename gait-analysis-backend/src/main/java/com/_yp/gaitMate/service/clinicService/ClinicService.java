package com._yp.gaitMate.service.clinicService;

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.dto.page.PageResponseDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClinicService {
    ClinicInfoResponse createClinic(CreateClinicRequest request);
    ClinicInfoResponse getClinicById(Long id);

    ClinicInfoResponse getMyClinicProfile();

//    List<ClinicInfoResponse> getAllClinics();

    PageResponseDto<ClinicInfoResponse> getAllClinics(Pageable pageable);

}
