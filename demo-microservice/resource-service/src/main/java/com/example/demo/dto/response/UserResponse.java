package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long userId;
    String fullName;
    String passwordHash;
    String email;
    String phone;
    Integer roleId;
    String status = "active"; // mặc định
    LocalDateTime createdAt = LocalDateTime.now();
}
