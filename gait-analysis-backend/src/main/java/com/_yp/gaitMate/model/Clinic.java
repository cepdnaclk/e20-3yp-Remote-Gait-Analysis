package com._yp.gaitMate.model;

import com._yp.gaitMate.security.model.AccountStatus;
import com._yp.gaitMate.security.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
/**
 * Represents a physiotherapy clinic registered in the gait analysis system.
 * Each clinic has a linked user account and manages patients, sensor kits, and staff.
 */
@Entity
@Table(name = "clinic")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Name of the clinic.
     */
    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * User account associated with the clinic for authentication.
     */
    //TODO: decide the cascading
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    /**
     * Patients registered under this clinic.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Patient> patients = new ArrayList<>();

    /**
     * Sensor kits owned by the clinic.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SensorKit> sensorKits = new ArrayList<>();;

    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Doctor> doctors = new ArrayList<>();


    @Column(name = "invitation_token", unique = true)
    private String invitationToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus = AccountStatus.INVITATION_SENT;
}

