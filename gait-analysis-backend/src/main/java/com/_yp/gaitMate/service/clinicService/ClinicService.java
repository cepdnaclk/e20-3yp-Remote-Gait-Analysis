package com._yp.gaitMate.service.clinicService;

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;

import java.util.List;

public interface ClinicService {
    ClinicInfoResponse createClinic(CreateClinicRequest request);
    ClinicInfoResponse getClinicById(Long id);

    ClinicInfoResponse getMyClinicProfile();

    List<ClinicInfoResponse> getAllClinics();

    List<DoctorInfoResponse> getDoctorsOfLoggedInClinic(); //NEW to get doctors list in clinic page
}
