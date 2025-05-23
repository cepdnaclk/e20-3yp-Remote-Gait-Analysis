package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.command.CommandRequestDto;
import com._yp.gaitMate.service.commandService.CommandService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commands")
@RequiredArgsConstructor
public class CommandController {

    private final CommandService commandService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Send commands to sensor device")
    public ResponseEntity<ApiResponse> handleCommand(@RequestBody @Valid CommandRequestDto request) {
        // call the commandService to publish the command to IoT core
        ApiResponse response = commandService.sendCommandToSensor(request);
        return ResponseEntity.ok(response);
    }
}
