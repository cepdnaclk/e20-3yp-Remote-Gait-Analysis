package com._yp.gaitMate.dto.testSession;

import com._yp.gaitMate.model.TestSession.Status;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
        private Integer cadence;
        private Integer stepLength;
        private Integer strideLength;
        private Double stepTime;
        private Double strideTime;
        private Double speed;
        private Double symmetryIndex;
        private String pressureResultsPath;
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
