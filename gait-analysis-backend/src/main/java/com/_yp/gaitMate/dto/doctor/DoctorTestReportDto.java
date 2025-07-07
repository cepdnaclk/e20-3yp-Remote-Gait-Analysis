package com._yp.gaitMate.dto.doctor;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class DoctorTestReportDto {
    private Long sessionId;
    private Long patientId;
    private String patientName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private ProcessedResults results;

    @Getter
    @Setter
    @Builder
    public static class ProcessedResults {
        private Integer steps;
        private Double cadence;
        private AvgForce avgForce;
        private Double balanceScore;
        private Integer peakImpact;
        private Double durationSeconds;
        private Double avgSwingTime;
        private Double avgStanceTime;
        private List<Double> strideTimes;
        private String reportURL;   //report URL
    }

    @Getter
    @Setter
    @Builder
    public static class AvgForce {
        private Double heel;
        private Double toe;
        private Double midfoot;
    }

}
