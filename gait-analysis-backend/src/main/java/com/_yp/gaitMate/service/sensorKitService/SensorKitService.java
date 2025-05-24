package com._yp.gaitMate.service.sensorKitService;

import com._yp.gaitMate.dto.sensorKit.AssignSensorKitsRequest;
import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;
import com._yp.gaitMate.model.SensorKit;
import jakarta.validation.Valid;

import java.util.List;

public interface SensorKitService {

    SensorKitResponse createSensorKit(CreateSensorKitRequest request);

    SensorKitResponse getSensorKit(Long id);

    List<SensorKitResponse> getAllSensorKits();

    void deleteSensorKit(Long id);

    void setCalibrationStatus(Long sensorKitId, Boolean isCalibrated);

    String getUsernameBySensorKitId(Long sensorKitId);

//    List<SensorKitResponse> getAllSensorKitsOfLoggedInClinic();


    void assignToClinic(AssignSensorKitsRequest request);

    List<SensorKitResponse> getSensorKitsOfLoggedInClinicByStatus(SensorKit.Status status);
}
