package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    private String id;
    private Long userId;
    private String title;
    private String message;
    private String incidentType;
    private Integer severity;
    private String location;
    private LocalDateTime timestamp;
}
