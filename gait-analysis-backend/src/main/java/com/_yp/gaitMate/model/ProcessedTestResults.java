package com._yp.gaitMate.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stores the processed gait analysis results for a test session.
 * These are calculated after the test using raw sensor data.
 */
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
     * Cadence represents the number of steps taken per minute.
     */
    @Column(nullable = false)
    private Integer cadence;

    /**
     * The average length of a single step in centimeters.
     */
    @Column(nullable = false)
    private Integer stepLength;

    /**
     * The average length of a full stride (typically double the step length).
     */
    @Column(nullable = false)
    private Integer strideLength;

    /**
     * Average time taken for one step, in seconds.
     */
    @Column(nullable = false)
    private Double stepTime;

    /**
     * Average time taken for one full stride, in seconds.
     */
    @Column(nullable = false)
    private Double strideTime;

    /**
     * Walking speed of the patient during the test, in meters per second.
     */
    @Column(nullable = false)
    private Double speed;

    /**
     * Symmetry index represents balance between left and right gait cycle (%).
     * A value close to 100 indicates high symmetry.
     */
    @Column(nullable = false)
    private Double symmetryIndex;

    /**
     * Path to the stored pressure distribution image or heatmap (e.g., in S3 or Supabase).
     */
    @Column(nullable = false)
    private String pressureResultsPath;
}

