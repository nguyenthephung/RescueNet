package com.example.demo.service;

import com.example.demo.dto.request.IncidentRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.response.IncidentResponse;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.IncidentMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.Incident;
import com.example.demo.model.User;
import com.example.demo.repository.IncidentRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional
public class IncidentService {
    IncidentRepository incidentRepository;
    IncidentMapper incidentMapper;
    UserRepository userRepository;
    RateLimitService rateLimitService;
    UserEventPublisher userEventPublisher;

//    KafkaTemplate<String,String> kafkaTemplate;
    public IncidentResponse createIncident(IncidentRequest request) {
        if(!userRepository.existsById(request.getReporterId()))
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        if (!rateLimitService.allowRequest(request.getReporterId()))
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        Incident incident = incidentMapper.toIncident(request);
        incidentRepository.save(incident);
        // Publish user registered event to Kafka
        try {
            userEventPublisher.publishUserRegisteredNotification(incident);
            log.info("Published publishUserRegisteredNotification for user: {}", incident.getReporterId());
        } catch (Exception e) {
            log.error("Failed to publish publishUserRegisteredNotification for user: {}", incident.getReporterId(), e);
            // Don't fail the registration if event publishing fails
            // The profile can be created later through retry or manual process
        }
        return incidentMapper.toIncidentResponse(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }
    public List<Incident> getIncident(Long userId) {
        List<Incident> incidents = incidentRepository.findByreporterId(userId);
        if (incidents.isEmpty()) {
            throw new RuntimeException("No incidents found for user ID: " + userId);
        }
        return incidents;
    }


}
