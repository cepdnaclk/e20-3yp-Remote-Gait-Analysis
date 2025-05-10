package com._yp.gaitMate.repository;

import com._yp.gaitMate.model.RawSensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawSensorDataRepository extends JpaRepository<RawSensorData, Long> {
}