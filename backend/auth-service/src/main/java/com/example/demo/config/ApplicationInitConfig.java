package com.example.demo.config;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            // Seed system roles if missing
            seedRoles();

            // Create admin user if not exists
            if (userRepository.findByfullName("admin").isEmpty()) {
                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName("SYSTEM_ADMIN")
                        .orElseThrow(() -> new RuntimeException("SYSTEM_ADMIN role not found"));
                roles.add(adminRole);

                User user = User.builder()
                        .fullName("admin")
                        .passwordHash(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .email("admin@example.com")
                        .emailVerified(true)
                        .status("active")
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
        };
    }

    private void seedRoles() {
        createRoleIfMissing("CITIZEN", "Citizen role - Regular users who can report emergencies");
        createRoleIfMissing("DISPATCHER", "Dispatcher role - Manages emergency calls and coordinates responses");
        createRoleIfMissing("RESCUE_TEAM_MEMBER", "Rescue Team Member role - Participates in rescue operations");
        createRoleIfMissing("HOSPITAL", "Hospital role - Healthcare facilities managing patients");
        createRoleIfMissing("GOVERNMENT", "Government role - Government officials with oversight access");
        createRoleIfMissing("SYSTEM_ADMIN", "System Admin role - Full system administration access");
    }

    private void createRoleIfMissing(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder().name(name).description(description).build();
            roleRepository.save(role);
            log.info("Seeded role: {}", name);
        }
    }
}
