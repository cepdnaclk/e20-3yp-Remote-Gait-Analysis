package com._yp.gaitMate.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Represents feedback provided by a physiotherapist
 * after reviewing a patient's gait test session.
 */
@Entity
@Table(name = "feedback")
@EntityListeners(AuditingEntityListener.class)
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
    @CreatedDate
    @Column(nullable = false , updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = true)
    private LocalDateTime updatedAt;

}

