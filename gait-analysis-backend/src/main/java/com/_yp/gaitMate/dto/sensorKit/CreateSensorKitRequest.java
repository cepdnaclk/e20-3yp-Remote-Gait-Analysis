package com._yp.gaitMate.dto.sensorKit;

import com._yp.gaitMate.model.SensorKit.Status;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSensorKitRequest {
    @NotNull
    private Long serialNo;

    @NotNull
    private Long firmwareVersion;

}
