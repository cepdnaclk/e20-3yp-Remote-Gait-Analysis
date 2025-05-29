package com._yp.gaitMate.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "processed_test_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ProcessedTestResults {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The test session this result belongs to.
     */
    @OneToOne
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private TestSession session;

    @Column(nullable = false)
    private Integer steps;

    @Column(nullable = false)
    private Double cadence;

    @Column(nullable = false)
    private Double avgHeelForce;

    @Column(nullable = false)
    private Double avgToeForce;

    @Column(nullable = false)
    private Double avgMidfootForce;

    @Column(nullable = false)
    private Double balanceScore;

    @Column(nullable = false)
    private Integer peakImpact;

    @Column(nullable = false)
    private Double durationSeconds;

    @Column(nullable = false)
    private Double avgSwingTime;

    @Column(nullable = false)
    private Double avgStanceTime;

    @Column(nullable = false)
    private String pressureResultsPath;

    /**
     * Stores individual stride times if available.
     */
    @Convert(converter = com._yp.gaitMate.util.DoubleListToStringConverter.class)
    @Column(name = "stride_times", columnDefinition = "TEXT")
    private List<Double> strideTimes;
}
