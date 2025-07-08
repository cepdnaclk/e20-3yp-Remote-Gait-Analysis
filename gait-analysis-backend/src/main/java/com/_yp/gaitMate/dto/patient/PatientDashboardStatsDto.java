package com._yp.gaitMate.dto.patient;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientDashboardStatsDto {

    private long totalSessions;
    private long completedSessions;
    private long failedSessions;

    private AverageMetricsDto averageMetrics;
    private LatestSessionDto latestSession;
    private TrendsDto trends;
    private MonthlyStatsDto monthlyStats;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AverageMetricsDto {
        private double balanceScore;
        private double steps;
        private double cadence;
        private double sessionDuration;
    }

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LatestSessionDto {
        private Long sessionId;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private SessionResultDto results;
        private FeedbackDto feedback;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionResultDto {
        private int steps;
        private double balanceScore;
        private double cadence;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FeedbackDto {
        private String notes;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TrendsDto {
        private String balanceScoreChange;
        private String stepsChange;
        private String cadenceChange;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyStatsDto {
        private int sessionsThisMonth;
        private int sessionsLastMonth;
        private int consistencyScore;
    }
}
