package com._yp.gaitMate.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Represents a single test session performed by a patient using the sensor kit.
 * Stores references to raw sensor data, processed results, and physiotherapist feedback.
 */
@Entity
@Table(name = "test_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestSession {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Timestamp when the test started.
     */
    @Column(nullable = false)
    private LocalDateTime startTime;

    /**
     * Timestamp when the test ended.
     */
    private LocalDateTime endTime;

    /**
     * Current status of the test session.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    /**
     * The patient who performed this test.
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    /**
     * The processed gait analysis results for this test.
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "results_id")
    private ProcessedTestResults results;

    /**
     * Feedback from the physiotherapist for this test.
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "feedback_id")
    private Feedback feedback;

    /**
     * Raw sensor data file for this session.
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "raw_data_id")
    private RawSensorData rawSensorData;

    /**
     * Enum representing the state of the test session.
     */
    public enum Status {
        ACTIVE,
        PROCESSING,
        COMPLETED,
        FAILED
    }
}

