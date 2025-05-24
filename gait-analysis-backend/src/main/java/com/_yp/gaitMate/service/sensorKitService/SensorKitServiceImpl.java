package com._yp.gaitMate.service.sensorKitService;

import com._yp.gaitMate.dto.sensorKit.AssignSensorKitsRequest;
import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;
import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.mapper.SensorKitMapper;
import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.model.SensorKit;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.repository.SensorKitRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SensorKitServiceImpl implements SensorKitService {

    private static final Logger log = LoggerFactory.getLogger(SensorKitServiceImpl.class);
    private final SensorKitRepository sensorKitRepository;
    private final SensorKitMapper sensorKitMapper;
    private final AuthUtil authUtil;
    private final ClinicRepository clinicRepository;

    @Override
    public SensorKitResponse createSensorKit(CreateSensorKitRequest request) {

        if (sensorKitRepository.existsBySerialNo(request.getSerialNo())) {
            throw new ApiException("SensorKit with serial number " + request.getSerialNo() + " already exists");
        }

        SensorKit sensorKit = sensorKitMapper.toSensorKit(request);
        sensorKit.setStatus(SensorKit.Status.IN_STOCK);
        SensorKit savedKit = sensorKitRepository.save(sensorKit);
        return sensorKitMapper.toSensorKitResponse(savedKit);
    }

    @Override
    public SensorKitResponse getSensorKit(Long id) {
        SensorKit sensorKit = sensorKitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SensorKit", "id", id));
        return sensorKitMapper.toSensorKitResponse(sensorKit);
    }

    @Override
    public List<SensorKitResponse> getAllSensorKits() {
        return sensorKitRepository.findAll()
                .stream()
                .map(sensorKitMapper::toSensorKitResponse)
                .toList();
    }

    @Override
    public void deleteSensorKit(Long id) {
        SensorKit sensorKit = sensorKitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SensorKit", "id", id));
        sensorKitRepository.delete(sensorKit);
    }

    @Override
    public void setCalibrationStatus(Long sensorKitId, Boolean isCalibrated) {
        SensorKit sensorKit = sensorKitRepository.findById(sensorKitId)
                .orElseThrow(() -> new ResourceNotFoundException("SensorKit", "id", sensorKitId));

        if (!sensorKit.getStatus().equals(SensorKit.Status.IN_USE)){
            log.warn("⚠️ Attempted to calibrate SensorKit [{}] with invalid status: {}", sensorKitId, sensorKit.getStatus());
        }

        sensorKit.setIsCalibrated(isCalibrated);
        sensorKitRepository.save(sensorKit);
    }

    @Override
    public String getUsernameBySensorKitId(Long sensorKitId) {
        SensorKit sensorKit = sensorKitRepository.findById(sensorKitId)
                .orElseThrow(() -> new ResourceNotFoundException("SensorKit", "id", sensorKitId));

        if (sensorKit.getPatient() == null || sensorKit.getPatient().getUser() == null) {
            log.error("No patient or user is linked to SensorKit {}", sensorKitId);
            return null;
        }

        return sensorKit.getPatient().getUser().getUsername();
    }



    @Override
    public void assignToClinic(AssignSensorKitsRequest request) {
        Clinic clinic = clinicRepository.findById(request.getClinicId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "id", request.getClinicId()));

        List<SensorKit> kits = sensorKitRepository.findAllByIdIn(request.getSensorKitIds());

        if (kits.size() != request.getSensorKitIds().size()) {
            throw new ApiException("Some sensor kits do not exist");
        }

        for (SensorKit kit : kits) {
            if (kit.getStatus() != SensorKit.Status.IN_STOCK) {
                throw new ApiException("SensorKit " + kit.getId() + " is not in IN_STOCK status");
            }
            kit.setClinic(clinic);
            kit.setStatus(SensorKit.Status.AVAILABLE); // Assuming status transitions from IN_STOCK → AVAILABLE
        }

        sensorKitRepository.saveAll(kits);
    }

    @Override
    public List<SensorKitResponse> getSensorKitsOfLoggedInClinicByStatus(SensorKit.Status status) {
        List<SensorKit> kits;


        Clinic clinic = authUtil.getLoggedInClinic();
        kits = (status != null)
                ? sensorKitRepository.findByClinicAndStatus(clinic, status)
                : sensorKitRepository.findByClinic(clinic);


        return kits.stream()
                .map(sensorKitMapper::toSensorKitResponse)
                .toList();
    }


}

