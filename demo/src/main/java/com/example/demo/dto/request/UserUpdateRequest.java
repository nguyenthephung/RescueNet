package com.example.demo.dto.request;

import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    Long userId;
    String fullName;
    String passwordHash;
    String email;
    String phone;
    Integer roleId;
    String status = "active"; // mặc định
    LocalDateTime createdAt = LocalDateTime.now();
}
