package com._yp.gaitMate.dto.testSession;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * A generic DTO for handling test session actions such as START and STOP.
 * Contains the action type and a timestamp string in ISO 8601 format.
 *
 * Example payload:
 * {
 *   "action": "START",
 *   "timestamp": "2024-05-17T13:34:08"
 * }
 */
@Getter
@Setter
public class TestSessionActionDto {

    @NotNull
    private TestSessionActionType action;

    @NotNull
    private Instant timestamp;
}
