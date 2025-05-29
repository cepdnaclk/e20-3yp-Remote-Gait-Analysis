package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.Clinic;
import com._yp.gaitMate.model.SensorKit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SensorKitRepository extends JpaRepository<SensorKit, Long> {
    Boolean existsBySerialNo(Long serialNo);

    List<SensorKit> findByClinic(Clinic clinic);

    List<SensorKit> findAllByStatus(SensorKit.Status status);

    List<SensorKit> findAllByIdIn(Collection<Long> ids);

    List<SensorKit> findByClinicAndStatus(Clinic clinic, SensorKit.Status status);
}