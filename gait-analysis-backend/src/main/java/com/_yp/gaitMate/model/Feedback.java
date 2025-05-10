package com._yp.gaitMate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Represents feedback provided by a physiotherapist
 * after reviewing a patient's gait test session.
 */
@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Free-text notes entered by the physiotherapist.
     * TEXT column type is used for notes to allow long input (e.g., multiple lines of observations).
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String notes;

    /**
     * Timestamp indicating when the feedback was created.
     */
    @Column(nullable = false)
    private LocalDateTime createdAt;
}

