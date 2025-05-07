package com._yp.gaitMate.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a staff member working at a clinic.
 * This can include physiotherapists, assistants, or admin personnel.
 */
@Entity
@Table(name = "staff_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffMember {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Full name of the staff member.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Role or title (e.g., Physiotherapist, Assistant).
     */
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String profilePicture;

    /**
     * The clinic this staff member belongs to.
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;
}

