package com.example.demo.service;

import com.example.demo.config.KafkaTopicConfig;
import com.example.demo.model.User;
import com.rescuenet.events.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishUserRegisteredEvent(User user) {
        try {
            // Create event
            UserRegisteredEvent event = UserRegisteredEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType("USER_REGISTERED")
                    .timestamp(Instant.now())
                    .correlationId(UUID.randomUUID().toString())
                    .source("auth-service")
                    .version("1.0")
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .role(user.getRoles().isEmpty() ? "CITIZEN" : user.getRoles().iterator().next().getName())
                    .emailVerified(user.getEmailVerified())
                    .status(user.getStatus())
                    .build();

            log.info("Publishing UserRegisteredEvent for user: {} with eventId: {}", 
                    user.getEmail(), event.getEventId());

            // Send to Kafka
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                    KafkaTopicConfig.USER_REGISTERED_TOPIC,
                    user.getUserId().toString(),  // Use userId as partition key
                    event
            );

            // Handle success/failure
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Successfully published UserRegisteredEvent for user: {} to partition: {} with offset: {}",
                            user.getEmail(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish UserRegisteredEvent for user: {}", user.getEmail(), ex);
                }
            });

        } catch (Exception e) {
            log.error("Error creating UserRegisteredEvent for user: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to publish user registered event", e);
        }
    }
}
