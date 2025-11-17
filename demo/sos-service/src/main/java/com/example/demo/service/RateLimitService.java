package com.example.demo.service;

import com.example.demo.dto.request.IncidentRequest;
import com.example.demo.dto.response.IncidentResponse;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.IncidentMapper;
import com.example.demo.model.Incident;
import com.example.demo.repository.IncidentRepository;
import com.example.demo.repository.UserRepository;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RateLimitService {
    Map<Integer, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean allowRequest(Long reporterId) {
        Bucket bucket = buckets.computeIfAbsent(Math.toIntExact(reporterId), id -> Bucket4j.builder()
                .addLimit(Bandwidth.classic(1, Refill.intervally(1, Duration.ofMinutes(2))))
                .build());
        return bucket.tryConsume(1);
    }
}
