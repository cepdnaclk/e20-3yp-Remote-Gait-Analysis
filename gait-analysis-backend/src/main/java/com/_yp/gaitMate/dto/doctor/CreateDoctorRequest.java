package com._yp.gaitMate.dto.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDoctorRequest {

    /**
     * Full name of the doctor.
     */
    @NotBlank(message = "Doctor name is required")
    private String name;

    /**
     * Email of the doctor (used for display, not login).
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    /**
     * Phone number of the doctor.
     */
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    /**
     * Doctor’s medical specialization (e.g., neurology, orthopedics, physiotherapist).
     */
    @NotBlank(message = "Specialization is required")
    private String specialization;

    /**
     * Username for the doctor's user account.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 20)
    private String username;

    /**
     * Password for the doctor's user account.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20)
    private String password;
}

