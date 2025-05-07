package com._yp.gaitMate.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a wearable sensor kit assigned to a patient for gait data collection.
 * Each kit belongs to a clinic and is uniquely identifiable by its UUID.
 */
@Entity
@Table(name = "sensorkit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorKit {

    /**
     * Unique identifier for the sensor kit (UUID).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


     /**
      * Current status of the sensor kit.
      * Indicates whether the kit is in use, available, or faulty.
      */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    /**
     * Serial number of the physical kit device.
     */
    @Column(nullable = false)
    private Long serialNo;

    /**
     * Firmware version of the ESP32 running in the kit.
     */
    @Column(nullable = false)
    private Long firmwareVersion;

    /**
     * The clinic to which this sensor kit is assigned.
     */
    @ManyToOne
    @JoinColumn(name = "clinicId", nullable = false)
    private Clinic clinic;

    /**
     * Bi-directional relationship: the patient this kit is currently assigned to.
     * Note: mappedBy is defined in the Patient entity.
     */
    @OneToOne(mappedBy = "sensorKit", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Patient patient;



    /**
     * Enum representing the current status of the sensor kit.
     **/
    public enum Status {
        IN_USE,
        AVAILABLE,
        FAULTY
    }

}


