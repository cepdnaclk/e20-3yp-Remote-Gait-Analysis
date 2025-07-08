package com._yp.gaitMate.model;

import com._yp.gaitMate.security.model.AccountStatus;
import com._yp.gaitMate.security.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a patient in the gait analysis system.
 * A patient is associated with a specific clinic, user account, and optionally a sensor kit.
 */
@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Full name of the patient.
     */
    @Column(nullable = false)
    private String name;

    /**
     * National Identity Card number
     */
    @Column(name = "nic_number", nullable = false)
    private String nic;

    /**
     * Link to the patient's profile picture (optional).
     */
    private String profilePicture;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private Integer age;

    /**
     * Height in cm
     */
    @Column(nullable = false)
    private Integer height;

    /**
     * Weight in kg
     */
    @Column(nullable = false)
    private Integer weight;

    /**
     * Gender of the patient: male, female, or other.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Associated user account.
     */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    /**
     * The clinic this patient belongs to.
     */

    @ManyToOne
    @JoinColumn(name = "clinicId", nullable = false)
    private Clinic clinic;

    /**
     * The sensor kit assigned to this patient.
     */
    @OneToOne(optional = false)
    private SensorKit sensorKit;

    /**
     * List of test sessions performed by the patient.
     */
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TestSession> testSessions = new ArrayList<>();;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "invitation_token", unique = true, nullable = false)
    private String invitationToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus = AccountStatus.INVITATION_SENT;

    // Add the enum (if you didn't create it as a separate file)


    /**
     * Enum for allowed gender values.
     */
    public enum Gender {
        MALE,
        FEMALE,
        OTHER
    }


    public void assignSensorKit(SensorKit kit) {
        this.sensorKit = kit;
        kit.setPatient(this);
    }


}
