package com._yp.gaitMate.mapper;

import com._yp.gaitMate.dto.testSession.TestSessionDetailsResponse;
import com._yp.gaitMate.model.Feedback;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.model.RawSensorData;
import com._yp.gaitMate.model.TestSession;
import org.springframework.stereotype.Component;

/**
 * Maps TestSession and its nested entities to a full TestSessionDetailsResponse DTO.
 */
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
                        .cadence(r.getCadence())
                        .stepLength(r.getStepLength())
                        .strideLength(r.getStrideLength())
                        .stepTime(r.getStepTime())
                        .strideTime(r.getStrideTime())
                        .speed(r.getSpeed())
                        .symmetryIndex(r.getSymmetryIndex())
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
}
