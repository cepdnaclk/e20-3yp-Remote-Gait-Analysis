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

    @Min(value = 1, message = "Invalid age")
    @Max(value = 120, message = "Invalid age")
    private int age;

    @Min(value = 50, message = "Invalid height")
    @Max(value = 250, message = "Invalid height")
    private int height;

    @Min(value = 20, message = "Invalid weight")
    @Max(value = 300, message = "Invalid weight")
    private int weight;

    @NotNull
    @Pattern(regexp = "male|female|other", flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Gender must be 'male', 'female', or 'other'")
    private String gender;

//    @NotBlank
//    @Size(min = 4, max = 20)
//    private String username;
//
//    @NotBlank
//    @Size(min = 6, max = 30)
//    private String password;

    @NotNull
    private Long doctorId;

    @NotNull
    private Long sensorKitId;

    @NotBlank
    private String nic;
}

