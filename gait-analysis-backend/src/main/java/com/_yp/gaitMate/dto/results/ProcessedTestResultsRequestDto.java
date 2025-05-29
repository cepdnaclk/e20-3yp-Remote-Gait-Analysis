package com._yp.gaitMate.dto.results;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * DTO for receiving processed test results from the data processing microservice.
 */
@Getter
@Setter
public class ProcessedTestResultsRequestDto {

    @NotNull
    private Boolean status;

    @NotNull
    private Long sessionId;

    private Integer steps;

    private Double cadence;

    private Double avgHeelForce;

    private Double avgToeForce;

    private Double avgMidfootForce;

    private Double balanceScore;

    private Integer peakImpact;

    private Double durationSeconds;

    private Double avgSwingTime;

    private Double avgStanceTime;

    private String pressureResultsPath;

    private List<Double> strideTimes;
}
