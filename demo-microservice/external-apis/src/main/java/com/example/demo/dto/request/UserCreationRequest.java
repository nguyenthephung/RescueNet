package com.example.demo.dto.request;

import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.Size;



import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    Long userId;
    @Size(min = 4, message = "USERNAME_INVALID")
    String fullName;
    String email;
    String phone;
    @Size(min = 6, message = "INVALID_PASSWORD")
    String passwordHash;
    Integer roleId;
    String status = "active"; // mặc định
//    @DobConstraint(min = 10, message = "INVALID_DOB")
    LocalDateTime createdAt = LocalDateTime.now();
}
