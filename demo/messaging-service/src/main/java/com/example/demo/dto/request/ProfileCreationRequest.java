package com.example.demo.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {
    String userId;
    String username;
    String email;
    String phone;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
//    Integer roleId;
//    String status = "active"; // mặc định
////    @DobConstraint(min = 10, message = "INVALID_DOB")
//    LocalDateTime createdAt = LocalDateTime.now();
}
