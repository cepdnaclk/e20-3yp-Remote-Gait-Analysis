package com._yp.gaitMate.dto.doctor;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorInfoResponse {

    private Long id;

    /**
     * Full name of the doctor.
     */
    private String name;


    private String email;


    private String phoneNumber;

    /**
     * Doctor's medical specialization.
     */
    private String specialization;

    private String profilePicture;

    private String createdAt;

    private String accountStatus;
}
