package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;
import com._yp.gaitMate.service.sensorKitService.SensorKitService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(
            summary = "Create a new sensor kit",
            description = "Allows an admin to register a new SensorKit by providing serial number and firmware version."
    )
    public ResponseEntity<SensorKitResponse> createSensorKit(
            @RequestBody @Valid CreateSensorKitRequest request) {
        SensorKitResponse response = sensorKitService.createSensorKit(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get sensor kit by ID",
            description = "Fetch a single sensor kit using its unique ID."
    )
    public ResponseEntity<SensorKitResponse> getSensorKit(@PathVariable Long id) {
        SensorKitResponse response = sensorKitService.getSensorKit(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    @Operation(
            summary = "Get all sensor kits",
            description = "Returns a list of all sensor kits in the system."
    )
    public ResponseEntity<List<SensorKitResponse>> getAllSensorKits() {
        List<SensorKitResponse> responses = sensorKitService.getAllSensorKits();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete sensor kit",
            description = "Deletes a sensor kit by its ID. Only accessible to admins."
    )
    public ResponseEntity<Void> deleteSensorKit(@PathVariable Long id) {
        sensorKitService.deleteSensorKit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Update sensor kit  [TODO]",
            description = "Update firmware version or status of an existing sensor kit by ID."
    )
    public ResponseEntity<SensorKitResponse> updateSensorKit(
            @PathVariable Long id,
            @RequestBody @Valid CreateSensorKitRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('CLINIC')")
    @Operation(
            summary = "Get available sensor kits of the logged in clinic [TODO]"
    )
    public ResponseEntity<List<SensorKitResponse>> getAvailableSensorKitsOfClinic() {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
