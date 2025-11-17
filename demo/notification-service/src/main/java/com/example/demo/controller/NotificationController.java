package com.example.demo.controller;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.dto.request.NotificationRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.NotificationResponse;
import com.example.demo.model.User;
import com.example.demo.service.NotificationService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/notifications")
@Slf4j

public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/broadcast")
    public ApiResponse<List<NotificationResponse>> broadcastToRoles(@RequestBody NotificationRequest request) {

        ApiResponse<List<NotificationResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(notificationService.sendToRoles(request));
        return apiResponse;
    }
//    @KafkaListener(topics = "onboard-successful", groupId = "notification-group")
//    public void listen(String message){
//        log.info("Message received: {}", message);
//    }
}
