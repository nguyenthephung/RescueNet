package com.example.demo.service;

import com.example.demo.config.KafkaTopicConfig;
import com.example.demo.model.Incident;
//import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.rescuenet.events.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Publish NotificationEvent khi người dùng đăng ký thành công.
     * Event này sẽ được notification-service tiêu thụ để gửi email chào mừng, SMS xác thực, push notification,...
     */
    public void publishUserRegisteredNotification(Incident incident) {
        try {
//            String roleName = resolveRoleName(user);

           //  Tạo message thân thiện để gửi cho người dùng
            String welcomeMessage = String.format(
                    "Thông báo khẩn %s! Có thông báo cứu hộ khẩn cấp đến từ user %s.",
                    incident.getIncidentType(),   // ví dụ: loại sự cố
                    incident.getReporterId()      // user báo cáo
            );


            NotificationEvent event = NotificationEvent.builder()
                    // ============= Event Metadata =============
                    .eventId(UUID.randomUUID().toString())
                    .eventType("NOTIFICATION")               // hoặc "WELCOME_NOTIFICATION"
                    .timestamp(Instant.now())
                    .correlationId(UUID.randomUUID().toString())
                    .source("sos-service")
                    .version("1.0")

                    // ============= Business Data =============
                    // Các field không liên quan để null (notification-service sẽ bỏ qua)
                    .incidentId(incident.getIncidentId())
                    .reporterId(incident.getReporterId())                // dùng reporterId để lưu userId
                    .incidentType(incident.getIncidentType())           // tái sử dụng field này để phân loại
                    .description(incident.getDescription())
                    .mediaUrl(incident.getMediaUrl())
                    .gpsLat(incident.getGpsLat())
                    .gpsLng(incident.getGpsLng())
                    .severity(incident.getSeverity())
                    .status(incident.getStatus())
                    .createdAt(incident.getCreatedAt())

                    // Message chính mà notification-service sẽ dùng để gửi
                    .message(welcomeMessage)

                    // Thêm một số thông tin hữu ích khác (tuỳ chọn, nếu bạn mở rộng schema sau)
                    // Bạn có thể thêm custom fields bằng cách extend NotificationEvent hoặc dùng Map<String,Object> data nếu cần
                    .build();

            log.info("Publishing NotificationEvent (USER_REGISTERED) for user: {} with eventId: {}",
                    incident.getReporterId(), event.getEventId());

            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                    KafkaTopicConfig.INCIDENT_NOTIFICATION_TOPIC,   // có thể đổi tên topic thành NOTIFICATION_TOPIC nếu muốn
                    incident.getReporterId().toString(),             // partition key = userId → cùng user luôn vào cùng partition
                    event
            );

            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Successfully published NotificationEvent for user {} to partition {} offset {}",
                            incident.getReporterId(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish NotificationEvent for user {}", incident.getReporterId(), ex);
                }
            });

        } catch (Exception e) {
            log.error("Error while publishing NotificationEvent for user: {}", incident.getReporterId(), e);
            throw new RuntimeException("Failed to publish user registered notification event", e);
        }
    }


}