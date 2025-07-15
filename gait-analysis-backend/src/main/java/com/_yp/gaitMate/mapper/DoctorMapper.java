package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.model.Doctor;
import org.springframework.stereotype.Service;

@Service
public class DoctorMapper {
    public DoctorInfoResponse toDoctorInfoResponse(Doctor doctor) {
        return DoctorInfoResponse.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phoneNumber(doctor.getPhoneNumber())
                .specialization(doctor.getSpecialization())
                .createdAt(doctor.getCreatedAt().toString())
                .profilePicture(doctor.getProfilePicture())
                .accountStatus(doctor.getAccountStatus().name())
                .build();
    }
}
