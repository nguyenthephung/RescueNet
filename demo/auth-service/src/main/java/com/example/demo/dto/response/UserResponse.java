package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long userId;
    String fullName;
    String email;
    String phone;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
    Set<RoleResponse> roles;
    String status = "active"; // mặc định
    LocalDateTime createdAt = LocalDateTime.now();
}
