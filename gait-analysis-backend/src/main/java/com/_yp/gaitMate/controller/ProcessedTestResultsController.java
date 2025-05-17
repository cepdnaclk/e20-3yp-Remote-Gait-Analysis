package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.results.ProcessedTestResultsRequestDto;
import com._yp.gaitMate.service.processedTestResultsService.ProcessedTestResultsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@Slf4j
public class ProcessedTestResultsController {

    private final ProcessedTestResultsService processedTestResultsService;

    @PostMapping
    public ResponseEntity<ApiResponse> receiveProcessedResults(
            @RequestBody @Valid ProcessedTestResultsRequestDto request) {

        log.info("📥 Received processed results for session {}", request.getSessionId());
        processedTestResultsService.saveResults(request);
        return ResponseEntity.ok(new ApiResponse("Results saved successfully", true));
    }
}
