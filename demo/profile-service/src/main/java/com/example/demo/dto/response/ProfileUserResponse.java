package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileUserResponse {
    String id;
    String userId;
    String username;
    String email;
    String phone;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
}
