package com._yp.gaitMate.dto.sensorKit;

import com._yp.gaitMate.model.SensorKit.Status;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorKitResponse {
    private Long id;
    private Status status;
    private Long serialNo;
    private Long firmwareVersion;
    private Long clinicId;
    private Long patientId;
}

