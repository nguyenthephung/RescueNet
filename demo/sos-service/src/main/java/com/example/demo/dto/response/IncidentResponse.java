package com.example.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IncidentResponse {
    Long reporterId;
    String incidentType;
    String description;
    String mediaUrl;
    Double gpsLat;
    Double gpsLng;
    Integer severity;
    String status;
    LocalDateTime createdAt = LocalDateTime.now();
}
