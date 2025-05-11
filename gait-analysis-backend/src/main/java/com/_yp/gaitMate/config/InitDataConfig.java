package com._yp.gaitMate.config;

import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.Role;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.repository.RoleRepository;
import com._yp.gaitMate.security.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class InitDataConfig {
    // NOTE: Comment the @Bean line when doing the integration testing
//    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Retrieve or create roles
            Role patientRole = roleRepository.findByRoleName(AppRole.ROLE_PATIENT)
                    .orElseGet(() -> {
                        Role newPatientRole = new Role(AppRole.ROLE_PATIENT);
                        return roleRepository.save(newPatientRole);
                    });

            Role clinicRole = roleRepository.findByRoleName(AppRole.ROLE_CLINIC)
                    .orElseGet(() -> {
                        Role newClinicRole = new Role(AppRole.ROLE_CLINIC);
                        return roleRepository.save(newClinicRole);
                    });

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newAdminRole = new Role(AppRole.ROLE_ADMIN);
                        return roleRepository.save(newAdminRole);
                    });

            Set<Role> patientRoles = Set.of(patientRole);
            Set<Role> clinicRoles = Set.of(clinicRole);
            Set<Role> adminRoles = Set.of( adminRole);


            // Create users if not already present
            if (!userRepository.existsByUsername("patient1")) {
                User patient1 = new User("patient1", "patient1@example.com", passwordEncoder.encode("patientpassword"));
                userRepository.save(patient1);
            }

            if (!userRepository.existsByUsername("clinic1")) {
                User clinic1 = new User("clinic1", "clinic1@example.com", passwordEncoder.encode("clinicpassword"));
                userRepository.save(clinic1);
            }

            if (!userRepository.existsByUsername("admin1")) {
                User admin1 = new User("admin1", "admin1@example.com", passwordEncoder.encode("adminpassword"));
                userRepository.save(admin1);
            }

            // Update roles for existing users
            userRepository.findByUsername("patient1").ifPresent(user -> {
                user.setRoles(patientRoles);
                userRepository.save(user);
            });

            userRepository.findByUsername("clinic1").ifPresent(user -> {
                user.setRoles(clinicRoles);
                userRepository.save(user);
            });

            userRepository.findByUsername("admin1").ifPresent(user -> {
                user.setRoles(adminRoles);
                userRepository.save(user);
            });
        };
    }
}
