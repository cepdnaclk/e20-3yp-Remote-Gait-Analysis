package com._yp.gaitMate.dto.sensorKit;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AssignSensorKitsRequest {
    @NotNull
    private Long clinicId;

    @NotEmpty
    private List<Long> sensorKitIds;
}
