package com.example.demo.service;

import com.example.demo.dto.request.NotificationRequest;
import com.example.demo.dto.response.NotificationResponse;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.Notification;
import com.example.demo.model.User;
import com.example.demo.repository.mongo.NotificationRepository;
import com.example.demo.repository.jpa.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationService {
  UserRepository userRepository;
  NotificationRepository notificationRepository;
  NotificationMapper notificationMapper;
    public List<NotificationResponse> sendToRoles(NotificationRequest request) {
        List<User> recipients = userRepository.findByRoleNames(List.of("DISPATCHER", "ADMIN"));
        if (recipients.isEmpty()) {
            throw new RuntimeException("Không tìm thấy người nhận phù hợp với vai trò DISPATCHER hoặc ADMIN.");
        }
        List<NotificationResponse> responses = new ArrayList<>();
        for (User user : recipients) {
            Notification notification = Notification.builder()
                    .userId(user.getUserId())
                    .title(request.getTitle())
                    .message(request.getMessage())
                    .incidentType(request.getIncidentType())
                    .severity(request.getSeverity())
                    .location(request.getLocation())
                    .timestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now())
                    .build();

            Notification saved = notificationRepository.save(notification);
            responses.add(notificationMapper.toNotificationResponse(saved));
        }

        return responses;
    }
    public List<NotificationResponse> sendToRolesFromEvent(NotificationRequest request,String correlationId) {
        log.info("Creating notification from event with correlationId: {}, userId: {}",
                correlationId, request.getUserId());
        List<User> recipients = userRepository.findByRoleNames(List.of("DISPATCHER", "ADMIN"));
        if (recipients.isEmpty()) {
            throw new RuntimeException("Không tìm thấy người nhận phù hợp với vai trò DISPATCHER hoặc ADMIN.");
        }
        List<NotificationResponse> responses = new ArrayList<>();
        for (User user : recipients) {
            Notification notification = Notification.builder()
                    .userId(user.getUserId())
                    .title(request.getTitle())
                    .message(request.getMessage())
                    .incidentType(request.getIncidentType())
                    .severity(request.getSeverity())
                    .location(request.getLocation())
                    .timestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now())
                    .build();

            Notification saved = notificationRepository.save(notification);
            NotificationResponse response = notificationMapper.toNotificationResponse(saved);
            responses.add(response);

            // Push realtime ngay sau khi lưu DB
            pushToUser(user.getUserId(), response);
        }
        log.info("Successful created notification from event with correlationId: {}, userId: {}",
                correlationId, request.getUserId());
        return responses;
    }
    private final SimpMessagingTemplate messagingTemplate;

    public void pushToUser(Long userId, NotificationResponse notification) {
        String destination = "/topic/notifications/" + userId;
        messagingTemplate.convertAndSend(destination, notification);
        log.info("Pushed notification to user {} at {}", userId, destination);
    }

}
