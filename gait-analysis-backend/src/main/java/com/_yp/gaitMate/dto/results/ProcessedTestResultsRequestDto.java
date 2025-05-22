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
    private Boolean status;

    @NotNull
    private Long sessionId;

    
    private Integer cadence;

    
    private Integer stepLength;

    
    private Integer strideLength;

    
    private Double stepTime;

    
    private Double strideTime;

  
    private Double speed;

    private Double symmetryIndex;

    private String pressureResultsPath;
}
