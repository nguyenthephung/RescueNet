package com.example.demo.controller;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.dto.request.IncidentRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.IncidentResponse;
import com.example.demo.model.Incident;
import com.example.demo.model.User;
import com.example.demo.service.IncidentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RestController
@RequestMapping("/incidents")
public class IncidentController {
//    KafkaTemplate<String,String> kafkaTemplate;

    IncidentService incidentService;

    @GetMapping()
    public List<Incident> getAllIncident() {
        return incidentService.getAllIncidents();
    }
    @GetMapping("/{userId}")
    public ApiResponse<Object> getIncident(@PathVariable Long userId) {
        List<Incident> incidents = incidentService.getIncident(userId);
        return  ApiResponse.builder().result(incidents).build();
    }

    @PostMapping()
    public ApiResponse<IncidentResponse> createIncident(@RequestBody @Valid IncidentRequest request) {
        ApiResponse<IncidentResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(incidentService.createIncident(request));
        return apiResponse;
    }
//    @PostMapping("/test")
//    public void testKafka() {
//        this.kafkaTemplate.send("sos-topic", "Test message from SOS " + System.currentTimeMillis())
//                .thenAccept(result -> {
//                    RecordMetadata metadata = result.getRecordMetadata();
//                    if (metadata != null) {
//                        log.info("Kafka send successful: topic={}, partition={}, offset={}",
//                                metadata.topic(),
//                                metadata.partition(),
//                                metadata.offset());
//                    } else {
//                        log.info("Kafka send completed with no metadata (result={})", result);
//                    }
//                })
//                .exceptionally(ex -> {
//                    log.error("Kafka send failed", ex);
//                    return null;
//                });
//    }



}
