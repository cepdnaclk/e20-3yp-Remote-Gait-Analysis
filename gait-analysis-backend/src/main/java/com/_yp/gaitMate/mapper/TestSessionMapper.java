package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.doctor.DoctorTestReportDto;
import com._yp.gaitMate.dto.testSession.TestSessionDetailsResponse;
import com._yp.gaitMate.model.Feedback;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.RawSensorData;
import com._yp.gaitMate.model.TestSession;
import org.springframework.stereotype.Component;

@Component
public class TestSessionMapper {

    public TestSessionDetailsResponse toDetailsResponse(TestSession session) {
        ProcessedTestResults r = session.getResults();
        Feedback f = session.getFeedback();
        RawSensorData d = session.getRawSensorData();

        return TestSessionDetailsResponse.builder()
                .sessionId(session.getId())
                .patientId(session.getPatient().getId())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .status(session.getStatus())

                .results(r != null ? TestSessionDetailsResponse.ProcessedResults.builder()
                        .steps(r.getSteps())
                        .cadence(r.getCadence())
                        .avgForce(TestSessionDetailsResponse.AvgForce.builder()
                                .heel(r.getAvgHeelForce())
                                .toe(r.getAvgToeForce())
                                .midfoot(r.getAvgMidfootForce())
                                .build())
                        .balanceScore(r.getBalanceScore())
                        .peakImpact(r.getPeakImpact())
                        .durationSeconds(r.getDurationSeconds())
                        .avgSwingTime(r.getAvgSwingTime())
                        .avgStanceTime(r.getAvgStanceTime())
                        .strideTimes(r.getStrideTimes()) // ✅ Decoded from JSON string
                        .pressureResultsPath(r.getPressureResultsPath())
                        .build() : null)

                .feedback(f != null ? TestSessionDetailsResponse.FeedbackDetails.builder()
                        .notes(f.getNotes())
                        .createdAt(f.getCreatedAt())
                        .build() : null)

                .rawSensorData(d != null ? TestSessionDetailsResponse.RawDataFile.builder()
                        .path(d.getPath())
                        .build() : null)

                .build();
    }

    public DoctorTestReportDto toDoctorTestReportDto(TestSession session) {
        ProcessedTestResults result = session.getResults();

        return DoctorTestReportDto.builder()
                .sessionId(session.getId())
                .patientId(session.getPatient().getId())
                .patientName(session.getPatient().getName())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .results(result != null ? DoctorTestReportDto.ProcessedResults.builder()
                        .steps(result.getSteps())
                        .cadence(result.getCadence())
                        .avgForce(DoctorTestReportDto.AvgForce.builder()
                                .heel(result.getAvgHeelForce())
                                .midfoot(result.getAvgMidfootForce())
                                .toe(result.getAvgToeForce())
                                .build())
                        .balanceScore(result.getBalanceScore())
                        .peakImpact(result.getPeakImpact())
                        .durationSeconds(result.getDurationSeconds())
                        .avgSwingTime(result.getAvgSwingTime())
                        .avgStanceTime(result.getAvgStanceTime())
                        .strideTimes(result.getStrideTimes())
                        .pressureResultsPath(result.getPressureResultsPath())
                        .build() : null)
                .build();
    }

}
