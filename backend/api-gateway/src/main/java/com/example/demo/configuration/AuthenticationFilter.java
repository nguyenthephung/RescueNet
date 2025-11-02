package com.example.demo.configuration;

import com.example.demo.dto.request.ApiResponse;
import com.example.demo.service.AuthService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {

    AuthService authService;
    ObjectMapper objectMapper = new ObjectMapper();

    @NonFinal
    private String[] publicEndpoints = {
            "/auth/users/register",
            "/auth/login",
            "/auth/logout",
            "/auth/introspect",
            "/auth/verify",
            "/auth/resend-code",
            "/profile/internal/create",
    };

    @Value("${app.api-prefix}")
    @NonFinal
    private String apiPrefix;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

        log.info("==== Enter Authentication Filter ====");
        log.debug("Request URL: {}", request.getURI());
        log.debug("HTTP Method: {}", request.getMethod());

        if (isPublicEndpoint(request)) {
            log.debug("Public endpoint accessed: {}", request.getURI().getPath());
            return chain.filter(exchange);
        }

        List<String> authHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
        log.debug("Authorization header: {}", authHeader);

        if (CollectionUtils.isEmpty(authHeader)) {
            log.warn("Missing Authorization header");
            return unauthenticated(response);
        }

        String token = authHeader.get(0).replace("Bearer", "").trim();
        log.debug("Extracted token: {}", token);

        return authService.introspect(token)
                .flatMap(introspectResponse -> {
                    log.debug("Introspect response: {}", introspectResponse);
                    if (introspectResponse.getResult().isValid()) {
                        log.debug("Token is valid");
                        return chain.filter(exchange);
                    } else {
                        log.warn("Token is invalid");
                        return unauthenticated(response);
                    }
                })
                .onErrorResume(throwable -> {
                    log.error("Error during token introspection", throwable);
                    return unauthenticated(response);
                });
    }

    @Override
    public int getOrder() {
        return -1;
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        boolean isPublic = Arrays.stream(publicEndpoints)
                .anyMatch(s -> request.getURI().getPath().matches(apiPrefix + s));
        log.debug("Is public endpoint: {}", isPublic);
        return isPublic;
    }

    private Mono<Void> unauthenticated(ServerHttpResponse response) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(4001)
                .message("Unauthenticated")
                .build();

        String body;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            log.error("Error serializing unauthenticated response", e);
            throw new RuntimeException(e);
        }

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        log.debug("Returning 401 response with body: {}", body);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
