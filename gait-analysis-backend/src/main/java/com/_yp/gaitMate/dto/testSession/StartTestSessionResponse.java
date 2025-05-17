package com._yp.gaitMate.dto.testSession;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents the response sent back after starting a test session.
 * Contains the ID of the created session.
 */
@Getter
@Setter
@AllArgsConstructor
@Builder
public class StartTestSessionResponse {
    private Long sessionId;
}
