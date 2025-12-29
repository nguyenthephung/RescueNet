package com.example.demo.service;

import com.example.demo.dto.request.NotificationRequest;
import com.rescuenet.events.NotificationEvent;
import com.rescuenet.events.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "rescuenet.incident.notification",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserRegisteredEvent(
            @Payload NotificationEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment
    ) {
        log.info("Received UserNotificationEvent: eventId={}, userId={}, partition={}, offset={}",
                event.getEventId(), event.getReporterId(), partition, offset);

        try {
            // Create profile from event
            NotificationRequest profileRequest = NotificationRequest.builder()
                    .userId(event.getReporterId())  // Convert Long to String for Neo4j
                    .title(event.getMessage())           // tái sử dụng field này để phân loại
                            .message(event.getDescription())
                                    .incidentType(event.getIncidentType())
                                            .severity(event.getSeverity())
                                                    .timestamp(event.getCreatedAt())
                                                            .location(String.valueOf(event.getGpsLat()+ ","+event.getGpsLng())).build();

            notificationService.sendToRolesFromEvent(profileRequest, event.getCorrelationId());

            // Acknowledge the message
            acknowledgment.acknowledge();
            
            log.info("Successfully processed UserNotificationEvent for userId: {}, correlationId: {}",
                    event.getReporterId(), event.getCorrelationId());

        } catch (Exception e) {
            log.error("Failed to process UserNotificationEvent: eventId={}, userId={}, correlationId={}",
                    event.getEventId(), event.getReporterId(), event.getCorrelationId(), e);
            
            // Don't acknowledge - message will be retried
            // In production, implement DLQ pattern for permanent failures
            throw new RuntimeException("Failed to create user profile from event", e);
        }
    }
}
