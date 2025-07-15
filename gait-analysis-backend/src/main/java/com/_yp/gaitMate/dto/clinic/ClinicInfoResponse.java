package com._yp.gaitMate.dto.clinic;

import lombok.*;

/**
 * DTO for sending clinic information back to clients.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicInfoResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String createdAt;
    private String accountStatus;
}
