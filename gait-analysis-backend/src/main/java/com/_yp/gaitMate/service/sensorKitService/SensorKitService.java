package com._yp.gaitMate.service.sensorKitService;

import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;

import java.util.List;

public interface SensorKitService {

    SensorKitResponse createSensorKit(CreateSensorKitRequest request);

    SensorKitResponse getSensorKit(Long id);

    List<SensorKitResponse> getAllSensorKits();

    void deleteSensorKit(Long id);

    void setClibrationStatus(Long sensorKitId, Boolean isCalibrated);
}
