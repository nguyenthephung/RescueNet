package com.example.demo.model;

import lombok.*;
import java.time.LocalDateTime;

// Simple POJO for Profile Service (không dùng JPA, chỉ dùng cho DTO mapping)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String passwordHash;
    private Integer roleId;
    private String status = "active"; // mặc định
    private LocalDateTime createdAt = LocalDateTime.now();
}