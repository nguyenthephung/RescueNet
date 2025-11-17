package com.example.demo.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    private Long userId;
    private String title;
    private String message;
    private String incidentType;
    private Integer severity;
    private String location;
    private LocalDateTime timestamp;

}
