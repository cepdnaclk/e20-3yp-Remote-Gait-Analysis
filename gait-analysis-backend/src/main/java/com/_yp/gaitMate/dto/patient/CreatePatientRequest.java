package com._yp.gaitMate.dto.patient;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePatientRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    @Min(1)
    private int age;

    @Min(50)
    @Max(250)
    private int height;

    @Min(20)
    @Max(300)
    private int weight;

    @NotNull
    @Pattern(regexp = "male|female|other", flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Gender must be 'male', 'female', or 'other'")
    private String gender;

    @NotBlank
    @Size(min = 4, max = 20)
    private String username;

    @NotBlank
    @Size(min = 6, max = 30)
    private String password;

    @NotNull
    private Long doctorId;

    @NotNull
    private Long sensorKitId;

    @NotBlank
    private String nic;
}

