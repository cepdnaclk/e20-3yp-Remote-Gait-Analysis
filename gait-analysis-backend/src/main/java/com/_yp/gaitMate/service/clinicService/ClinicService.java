package com._yp.gaitMate.service.clinicService;

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;

public interface ClinicService {
    ClinicInfoResponse createClinic(CreateClinicRequest request);
    ClinicInfoResponse getClinicById(Long id);
}
