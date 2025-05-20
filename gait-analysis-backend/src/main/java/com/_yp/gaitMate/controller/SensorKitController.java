package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensorkits")
@RequiredArgsConstructor
public class SensorKitController {

    private final SensorKitService sensorKitService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SensorKitResponse> createSensorKit(
            @RequestBody @Valid CreateSensorKitRequest request) {
        SensorKitResponse response = sensorKitService.createSensorKit(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SensorKitResponse> getSensorKit(@PathVariable Long id) {
        SensorKitResponse response = sensorKitService.getSensorKit(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<SensorKitResponse>> getAllSensorKits() {
        List<SensorKitResponse> responses = sensorKitService.getAllSensorKits();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSensorKit(@PathVariable Long id) {
        sensorKitService.deleteSensorKit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
