package com._yp.gaitMate.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteRequestDto {

    @NotBlank
    private String note;
}
