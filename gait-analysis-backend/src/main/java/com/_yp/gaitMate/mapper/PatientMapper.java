package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import com._yp.gaitMate.model.Patient;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {

    /**
     * Maps a Patient entity to a PatientInfoResponse DTO.
     *
     * @param patient the patient entity to map
     * @return mapped response DTO
     */
    public PatientInfoResponse toPatientInfoResponse(Patient patient) {
        return PatientInfoResponse.builder()
                .id(patient.getId())
                .name(patient.getName())
                .email(patient.getEmail())
                .phoneNumber(patient.getPhoneNumber())
                .age(patient.getAge())
                .height(patient.getHeight())
                .weight(patient.getWeight())
                .gender(patient.getGender().name())
                .createdAt(patient.getCreatedAt().toString())
                .doctorId(patient.getDoctor().getId())
                .sensorKitId(patient.getSensorKit().getId())
                .nic(patient.getNic())
                .doctorName(patient.getDoctor().getName())
                .accountStatus(patient.getAccountStatus().name())
                .build();
    }
}

