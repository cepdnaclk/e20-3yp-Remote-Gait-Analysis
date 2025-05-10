package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.model.Clinic;
import org.springframework.stereotype.Component;

/**
 * Maps Clinic entities to Clinic DTOs.
 */
@Component
public class ClinicMapper {

    public ClinicInfoResponse toClinicInfoResponse(Clinic clinic) {
        return ClinicInfoResponse.builder()
                .id(clinic.getId())
                .name(clinic.getName())
                .email(clinic.getEmail())
                .phoneNumber(clinic.getPhoneNumber())
                .createdAt(clinic.getCreatedAt().toString())
                .build();
    }
}
