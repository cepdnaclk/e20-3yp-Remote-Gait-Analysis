package com._yp.gaitMate.service.patientDashboardService;

import com._yp.gaitMate.dto.patient.PatientDashboardStatsDto;
import com._yp.gaitMate.mapper.PatientDashboardMapper;
import com._yp.gaitMate.model.Patient;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.TestSession;
import com._yp.gaitMate.model.TestSession.Status;
import com._yp.gaitMate.repository.ProcessedTestResultsRepository;
import com._yp.gaitMate.repository.TestSessionRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.function.ToDoubleFunction;

@Service
@RequiredArgsConstructor
public class PatientDashboardSerivceImpl implements PatientDashboardSerivce {

    private final AuthUtil authUtil;
    private final TestSessionRepository testSessionRepository;
    private final ProcessedTestResultsRepository processedTestResultsRepository;
    private final PatientDashboardMapper dashboardMapper;

    @Override
    public PatientDashboardStatsDto getDashboardStatsForCurrentPatient() {
        Patient patient = authUtil.getLoggedInPatient();

        List<TestSession> allSessions = testSessionRepository.findByPatientOrderByStartTimeDesc(patient);
        List<ProcessedTestResults> allResults = processedTestResultsRepository.findBySession_Patient(patient);

        long totalSessions = allSessions.size();
        long completedSessions = allSessions.stream().filter(s -> s.getStatus() == Status.COMPLETED).count();
        long failedSessions = allSessions.stream().filter(s -> s.getStatus() == Status.FAILED).count();

        double avgBalance = average(allResults, ProcessedTestResults::getBalanceScore);
        double avgSteps = average(allResults, ProcessedTestResults::getSteps);
        double avgCadence = average(allResults, ProcessedTestResults::getCadence);
        double avgDuration = allSessions.stream()
                .filter(s -> s.getStartTime() != null && s.getEndTime() != null)
                .mapToDouble(s -> java.time.Duration.between(s.getStartTime(), s.getEndTime()).getSeconds())
                .average()
                .orElse(0.0);


//        TestSession latestSession = allSessions.stream()
//                .filter(s -> s.getStatus() == Status.COMPLETED && s.getResults() != null)
//                .max(Comparator.comparing(TestSession::getStartTime))
//                .orElse(null);

        TestSession latestSession = testSessionRepository
                .findTop1ByPatientAndStatusOrderByStartTimeDesc(patient, Status.COMPLETED)
                .filter(s -> s.getResults() != null) // still needed in case there's no results yet
                .orElse(null);


        PatientDashboardStatsDto.TrendsDto trendsDto = computeTrends(allResults);
        PatientDashboardStatsDto.MonthlyStatsDto monthlyStatsDto = computeMonthlyStats(allSessions);

        return dashboardMapper.toDashboardStatsDto(
                totalSessions,
                completedSessions,
                failedSessions,
                avgBalance,
                avgSteps,
                avgCadence,
                avgDuration,
                latestSession,
                trendsDto,
                monthlyStatsDto
        );
    }

    private <T> double average(List<T> list, ToDoubleFunction<T> getter) {
        return list.stream().mapToDouble(getter).average().orElse(0.0);
    }


    private PatientDashboardStatsDto.TrendsDto computeTrends(List<ProcessedTestResults> results) {
        if (results.size() < 4) return new PatientDashboardStatsDto.TrendsDto("N/A", "N/A", "N/A");

        ProcessedTestResults latest = results.get(0);
        List<ProcessedTestResults> previous = results.subList(1, Math.min(4, results.size()));

        double prevBal = average(previous, ProcessedTestResults::getBalanceScore);
        double prevSteps = average(previous, ProcessedTestResults::getSteps);
        double prevCadence = average(previous, ProcessedTestResults::getCadence);

        return new PatientDashboardStatsDto.TrendsDto(
                formatPercent(percentChange(prevBal, latest.getBalanceScore())),
                formatPercent(percentChange(prevSteps, latest.getSteps())),
                formatPercent(percentChange(prevCadence, latest.getCadence()))
        );
    }

    private PatientDashboardStatsDto.MonthlyStatsDto computeMonthlyStats(List<TestSession> sessions) {
        YearMonth now = YearMonth.now();
        YearMonth last = now.minusMonths(1);

        long currentMonth = sessions.stream()
                .filter(s -> YearMonth.from(s.getStartTime()).equals(now))
                .count();

        long lastMonth = sessions.stream()
                .filter(s -> YearMonth.from(s.getStartTime()).equals(last))
                .count();

        int consistencyScore = (int) ((currentMonth / 8.0) * 100); // scale of 0-100

        return new PatientDashboardStatsDto.MonthlyStatsDto((int) currentMonth, (int) lastMonth, consistencyScore);
    }

    private double percentChange(double previous, double current) {
        if (previous == 0) return 0;
        return ((current - previous) / previous) * 100;
    }

    private String formatPercent(double value) {
        return String.format("%+.1f%%", value);
    }
}
