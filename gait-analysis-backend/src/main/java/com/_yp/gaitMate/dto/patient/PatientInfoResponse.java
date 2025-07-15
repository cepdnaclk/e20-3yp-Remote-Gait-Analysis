package com._yp.gaitMate.dto.patient;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientInfoResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private int age;
    private int height;
    private int weight;
    private String gender;
    private String createdAt;
    private Long doctorId;
    private String doctorName;
    private Long sensorKitId;
    private String nic;
    private String accountStatus;
}

