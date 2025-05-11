package com._yp.gaitMate.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stores a reference to the raw sensor data file produced during a gait test session.
 * This data is used later for processing and analysis.
 */
@Entity
@Table(name = "raw_sensor_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawSensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * File path or URL where the raw sensor data is stored.
     * Typically a JSON or CSV file saved in cloud storage.
     */
    @Column(nullable = false)
    private String path;
}

