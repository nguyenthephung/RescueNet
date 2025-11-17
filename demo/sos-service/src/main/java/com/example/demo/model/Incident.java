package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "incident_id")
    private Long incidentId;
    @Column(name = "reporter_id")
    private Integer reporterId;
    @Column(name = "incident_type")
    private String incidentType;
    @Column(name = "description")

    private String description;
    @Column(name = "media_url")

    private String mediaUrl;
    @Column(name = "gps_lat")

    private Double gpsLat;
    @Column(name = "gps_lng")

    private Double gpsLng;
    @Column(name = "severity")

    private Integer severity;
    @Column(name = "status")

    private String status;
    @Column(name = "created_at")

    private LocalDateTime createdAt = LocalDateTime.now();
}
