package com.example.demo.service;

import com.example.demo.dto.request.ProfileCreationRequest;
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

    private final UserProfileService userProfileService;

    @KafkaListener(
            topics = "rescuenet.user.registered",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserRegisteredEvent(
            @Payload UserRegisteredEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment
    ) {
        log.info("Received UserRegisteredEvent: eventId={}, userId={}, email={}, partition={}, offset={}",
                event.getEventId(), event.getUserId(), event.getEmail(), partition, offset);

        try {
            // Create profile from event
            ProfileCreationRequest profileRequest = ProfileCreationRequest.builder()
                    .userId(event.getUserId().toString())  // Convert Long to String for Neo4j
                    .email(event.getEmail())
                    .firstName(event.getFirstName())
                    .lastName(event.getLastName())
                    .phone(event.getPhone())
                    .build();

            userProfileService.createProfileFromEvent(profileRequest, event.getCorrelationId());

            // Acknowledge the message
            acknowledgment.acknowledge();
            
            log.info("Successfully processed UserRegisteredEvent for userId: {}, correlationId: {}",
                    event.getUserId(), event.getCorrelationId());

        } catch (Exception e) {
            log.error("Failed to process UserRegisteredEvent: eventId={}, userId={}, correlationId={}",
                    event.getEventId(), event.getUserId(), event.getCorrelationId(), e);
            
            // Don't acknowledge - message will be retried
            // In production, implement DLQ pattern for permanent failures
            throw new RuntimeException("Failed to create user profile from event", e);
        }
    }
}
