package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.SensorKit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorKitRepository extends JpaRepository<SensorKit, Long> {
}