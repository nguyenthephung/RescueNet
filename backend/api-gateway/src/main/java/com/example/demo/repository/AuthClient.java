package com.example.demo.repository;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.dto.request.IntrospectRequest;
import com.example.demo.dto.response.IntrospectResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface AuthClient {
    @PostExchange(url = "/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);
}
