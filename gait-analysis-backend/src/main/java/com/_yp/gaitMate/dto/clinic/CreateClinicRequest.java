package com._yp.gaitMate.dto.clinic;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.Length;

/**
 * DTO used by admin to register a new clinic with an associated user account.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateClinicRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 4, max = 20)
    private String username;

    @NotBlank
    @Size(min = 6, max = 20)
    private String password;
}

