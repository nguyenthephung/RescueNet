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

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class IncidentService {
    IncidentRepository incidentRepository;
    IncidentMapper incidentMapper;
    UserRepository userRepository;
    RateLimitService rateLimitService;
    KafkaTemplate<String,String> kafkaTemplate;
    public IncidentResponse createIncident(IncidentRequest request) {
        if(!userRepository.existsById(request.getReporterId()))
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        if (!rateLimitService.allowRequest(request.getReporterId()))
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        Incident incident = incidentMapper.toIncident(request);
        incidentRepository.save(incident);
//        kafkaTemplate.send("onboard-successful", "Test message from SOS").addCallback(result -> {
//            if (result != null && result.getRecordMetadata() != null) {
//                log.info("Kafka send successful: topic={}, partition={}, offset={}",
//                        result.getRecordMetadata().topic(),
//                        result.getRecordMetadata().partition(),
//                        result.getRecordMetadata().offset());
//            } else {
//                log.info("Kafka send completed with no metadata (result={})", result);
//            }
//        }, ex -> log.error("Kafka send failed", ex));
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
