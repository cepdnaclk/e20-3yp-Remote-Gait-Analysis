package com._yp.gaitMate.dto.testSession;

import com._yp.gaitMate.dto.patient.PatientInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload sent to the data-processing microservice after a test session is stopped.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessingRequestDto {

    private Long sensorId;

    private String startTime;

    private String endTime;

    private Long sessionId;

    private PatientInfoResponse patientInfo;
}

