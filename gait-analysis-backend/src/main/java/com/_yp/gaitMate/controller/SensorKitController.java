package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.sensorKit.AssignSensorKitsRequest;
import com._yp.gaitMate.dto.sensorKit.CreateSensorKitRequest;
import com._yp.gaitMate.dto.sensorKit.SensorKitResponse;
import com._yp.gaitMate.model.SensorKit;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class SensorKitController {

    private final SensorKitService sensorKitService;

    @PostMapping("/sensor-kits")
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


    @PostMapping("/sensor-kits/assign-to-clinic")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Assign IN_STOCK sensor kits to a clinic",
            description = "Allows an admin to assign one or more sensor kits to a clinic. Only kits with status IN_STOCK can be assigned."
    )
    public ResponseEntity<ApiResponse> assignSensorKitsToClinic(@RequestBody @Valid AssignSensorKitsRequest request) {
        sensorKitService.assignToClinic(request);
        return ResponseEntity.ok(new ApiResponse("Sensor kits assigned successfully", true));
    }

    @GetMapping("/sensor-kits/{id}")
    @Operation(
            summary = "Get sensor kit by ID",
            description = "Fetch a single sensor kit using its unique ID."
    )
    public ResponseEntity<SensorKitResponse> getSensorKit(@PathVariable Long id) {
        SensorKitResponse response = sensorKitService.getSensorKit(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/sensor-kits")
    @Operation(
            summary = "Get all sensor kits",
            description = "Returns a list of all sensor kits in the system."
    )
    public ResponseEntity<List<SensorKitResponse>> getAllSensorKits() {
        List<SensorKitResponse> responses = sensorKitService.getAllSensorKits();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }



//    @GetMapping("/clinic/me/sensor-kits")
//    @Operation(
//            summary = "Get all sensor kits of the logged in clinic"
//    )
//    @PreAuthorize("hasRole('CLINIC')")
//    public ResponseEntity<List<SensorKitResponse>> getAllSensorKitsOfLoggedInClinic() {
//        List<SensorKitResponse> sensorKits = sensorKitService.getAllSensorKitsOfLoggedInClinic();
//        return new ResponseEntity<>(sensorKits, HttpStatus.OK);
//    }


    @GetMapping("/clinics/me/sensor-kits")
    @PreAuthorize("hasRole('CLINIC')")
    @Operation(
            summary = "Get sensor kits of the logged in clinic, by status",
            description = "If the status is not provided, all the sensorKits of the logged in clinic will be sent"
    )
    public ResponseEntity<List<SensorKitResponse>> getSensorKitsOfLoggedInClinicByStatus(
            @RequestParam(required = false) SensorKit.Status status) {

        List<SensorKitResponse> sensorKits = sensorKitService.getSensorKitsOfLoggedInClinicByStatus(status);
        return new ResponseEntity<>(sensorKits, HttpStatus.OK);
    }

    @DeleteMapping("/sensor-kits/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete sensor kit",
            description = "Deletes a sensor kit by its ID. Only accessible to admins."
    )
    public ResponseEntity<Void> deleteSensorKit(@PathVariable Long id) {
        sensorKitService.deleteSensorKit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }







    // TODO ******************************************************

    @PutMapping("/sensor-kits/{id}")
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




}
