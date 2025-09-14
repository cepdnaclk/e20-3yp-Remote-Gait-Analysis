package com._yp.gaitMate.dto.testSession;

import com._yp.gaitMate.model.TestSession.Status;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class TestSessionDetailsResponse {
    private Long sessionId;
    private Long patientId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Status status;

    private ProcessedResults results;
    private FeedbackDetails feedback;
    private RawDataFile rawSensorData;

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
        private String pressureResultsPath;  //s3 bucket pdf report url
    }

    @Getter
    @Setter
    @Builder
    public static class AvgForce {
        private Double heel;
        private Double toe;
        private Double midfoot;
    }

    @Getter
    @Setter
    @Builder
    public static class FeedbackDetails {
        private String notes;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @Builder
    public static class RawDataFile {
        private String path;
    }
}
