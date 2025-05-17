package com._yp.gaitMate.dto.results;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for receiving processed test results from the data processing microservice.
 */
@Getter
@Setter
public class ProcessedTestResultsRequestDto {

    @NotNull
    private Long sessionId;

    @NotNull @Min(0)
    private Integer cadence;

    @NotNull @Min(0)
    private Integer stepLength;

    @NotNull @Min(0)
    private Integer strideLength;

    @NotNull @Min(0)
    private Double stepTime;

    @NotNull @Min(0)
    private Double strideTime;

    @NotNull @Min(0)
    private Double speed;

    @NotNull @Min(0)
    private Double symmetryIndex;

    @NotNull
    private String pressureResultsPath;
}
