package com._yp.gaitMate.security.repository;

import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);
}