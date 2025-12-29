package com.example.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IncidentRequest {
    @NotNull
    Long reporterId;
    @NotBlank
    String incidentType;
    @Size(max = 255) String description;
    String mediaUrl;
    @NotNull Double gpsLat;
    @NotNull Double gpsLng;
    @Min(1) @Max(5)Integer severity;
    String status = "Pending";
    LocalDateTime created_at = LocalDateTime.now();
}
