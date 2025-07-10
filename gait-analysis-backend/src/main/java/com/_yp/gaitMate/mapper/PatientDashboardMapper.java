package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.patient.PatientDashboardStatsDto;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.TestSession;
import org.springframework.stereotype.Component;

@Component
public class PatientDashboardMapper {

    public PatientDashboardStatsDto toDashboardStatsDto(
            long totalSessions,
            long completedSessions,
            long failedSessions,
            double avgBalance,
            double avgSteps,
            double avgCadence,
            double avgDuration,
            TestSession latestSession,
            PatientDashboardStatsDto.TrendsDto trends,
            PatientDashboardStatsDto.MonthlyStatsDto monthlyStats
    ) {
        PatientDashboardStatsDto.LatestSessionDto latestDto = null;
        if (latestSession != null && latestSession.getResults() != null) {
            ProcessedTestResults res = latestSession.getResults();
            String feedbackNotes = latestSession.getFeedback() != null
                    ? latestSession.getFeedback().getNotes()
                    : null;

            latestDto = PatientDashboardStatsDto.LatestSessionDto.builder()
                    .sessionId(latestSession.getId())
                    .startTime(latestSession.getStartTime())
                    .endTime(latestSession.getEndTime())
                    .results(new PatientDashboardStatsDto.SessionResultDto(
                            res.getSteps(),
                            res.getBalanceScore(),
                            res.getCadence()
                    ))
                    .feedback(new PatientDashboardStatsDto.FeedbackDto(feedbackNotes))
                    .build();
        }

        return PatientDashboardStatsDto.builder()
                .totalSessions(totalSessions)
                .completedSessions(completedSessions)
                .failedSessions(failedSessions)
                .averageMetrics(new PatientDashboardStatsDto.AverageMetricsDto(
                        avgBalance, avgSteps, avgCadence, avgDuration
                ))
                .latestSession(latestDto)
                .trends(trends)
                .monthlyStats(monthlyStats)
                .build();
    }

}
