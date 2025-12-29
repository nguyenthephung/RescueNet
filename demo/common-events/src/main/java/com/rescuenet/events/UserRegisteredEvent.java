package com.rescuenet.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Event published when a new user registers in the system
 * Producer: auth-service
 * Consumers: profile-service, analytics-service, notification-service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisteredEvent {
    
    // ============= Event Metadata =============
    
    /**
     * Unique event ID (UUID)
     */
    private String eventId;
    
    /**
     * Event type identifier
     */
    private String eventType;
    
    /**
     * When the event was created
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;
    
    /**
     * Correlation ID for distributed tracing
     */
    private String correlationId;
    
    /**
     * Source service that published this event
     */
    private String source;
    
    /**
     * Event version for schema evolution
     */
    private String version;
    
    // ============= Business Data =============
    
    /**
     * User ID from auth database
     */
    private Long userId;
    
    /**
     * User's email address
     */
    private String email;
    
    /**
     * User's full name
     */
    private String fullName;
    
    /**
     * User's first name
     */
    private String firstName;
    
    /**
     * User's last name
     */
    private String lastName;
    
    /**
     * User's phone number
     */
    private String phone;
    
    /**
     * User's role (CITIZEN, VOLUNTEER, STAFF, ADMIN)
     */
    private String role;
    
    /**
     * User's verification status
     */
    private Boolean emailVerified;
    
    /**
     * User account status (pending, active, suspended)
     */
    private String status;
}
