package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // ánh xạ đúng tên cột trong database
    private Long userId;
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    @Column(name = "phone", length = 20)
    private String phone;
    @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
    private String passwordHash;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "pending"; // mặc định pending cho đến khi verify
    
    @Column(name = "email_verified") // Remove nullable = false for now
    @Builder.Default
    private Boolean emailVerified = false; // Use Boolean instead of boolean to allow null
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "users_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> roles;
//    // Liên kết với bảng roles
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "role_id")
//    private Role role;
}