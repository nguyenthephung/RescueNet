package com.rescuenet.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * Event published when a new incident is reported in the system
 * Producer: sos-service
 * Consumers: notification-service, analytics-service, response-service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

    // ============= Event Metadata =============
    /** Unique event ID (UUID) */
    private String eventId;

    /** Event type identifier */
    private String eventType; // e.g. INCIDENT_REPORTED

    /** When the event was created */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;

    /** Correlation ID for distributed tracing */
    private String correlationId;

    /** Source service that published this event */
    private String source;

    /** Event version for schema evolution */
    private String version;

    // ============= Business Data =============
    /** Incident ID from sos-service */
    private Long incidentId;

    /** ID of the user who reported the incident */
    private Long reporterId;

    /** Type of incident (e.g. fire, accident, flood) */
    private String incidentType;

    /** Description of the incident */
    private String description;

    /** Media URL (image/video) attached to the report */
    private String mediaUrl;

    /** GPS latitude */
    private Double gpsLat;

    /** GPS longitude */
    private Double gpsLng;

    /** Severity level (1–5) */
    private Integer severity;

    /** Incident status (e.g. pending, resolved) */
    private String status;

    /** When the incident was created */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime createdAt;

    /** Notification message */
    private String message;
}
