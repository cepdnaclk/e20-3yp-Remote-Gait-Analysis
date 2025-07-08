package com._yp.gaitMate.model;

import com._yp.gaitMate.security.model.AccountStatus;
import com._yp.gaitMate.security.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Full name of the doctor.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Email address of the doctor.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Contact number of the doctor.
     */
    @Column(nullable = false)
    private String phoneNumber;

    /**
     * Specialization of the doctor (e.g., physiotherapy, rehabilitation).
     */
    @Column(nullable = false)
    private String specialization;

    private String profilePicture;

    /**
     * Timestamp of when the doctor was added.
     */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * The clinic this doctor is associated with.
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;


    /**
     * The user account linked to this doctor for authentication.
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "doctor", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<Patient> patients = new ArrayList<>();

    @Column(name = "invitation_token", unique = true, nullable = false)
    private String invitationToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus = AccountStatus.INVITATION_SENT;

}
