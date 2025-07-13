package com._yp.gaitMate.model;

import com._yp.gaitMate.model.enums.AppointmentStatus;
import com._yp.gaitMate.model.enums.AppointmentCreatedBy;
import com._yp.gaitMate.model.enums.AppointmentType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Corrected relationships
    @ManyToOne(optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType appointmentType;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentCreatedBy createdBy; // PATIENT, DOCTOR, CLINIC_ADMIN

    @Column(nullable = false)
    private Boolean isRecurring = false;

    // Auditing
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by_user", updatable = false)
    private String createdByUser;

    @LastModifiedBy
    @Column(name = "updated_by_user")
    private String updatedByUser;

    // Derived field
    @Transient
    public LocalDateTime getEndTime() {
        return startTime.plusMinutes(durationMinutes);
    }

    // Autofill default duration if not set
    @PrePersist
    public void setDefaultDurationIfMissing() {
        if (this.durationMinutes == null && this.appointmentType != null) {
            this.durationMinutes = this.appointmentType.getDefaultDuration();
        }
    }
}
