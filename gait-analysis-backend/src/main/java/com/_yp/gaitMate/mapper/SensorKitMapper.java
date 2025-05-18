package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;
import com._yp.gaitMate.model.SensorKit;
import org.springframework.stereotype.Service;

@Service
public class SensorKitMapper {

    public SensorKit toSensorKit(CreateSensorKitRequest request) {
        return SensorKit.builder()
                .serialNo(request.getSerialNo())
                .firmwareVersion(request.getFirmwareVersion())
                .isCalibrated(false)
                .build();
    }

    public SensorKitResponse toSensorKitResponse(SensorKit sensorKit) {
        Long clinicId = sensorKit.getClinic() != null ? sensorKit.getClinic().getId() : null;
        Long patientId = sensorKit.getPatient() != null ? sensorKit.getPatient().getId() : null;

        return SensorKitResponse.builder()
                .id(sensorKit.getId())
                .status(sensorKit.getStatus())
                .serialNo(sensorKit.getSerialNo())
                .firmwareVersion(sensorKit.getFirmwareVersion())
                .clinicId(clinicId)
                .patientId(patientId)
                .build();
    }
}
