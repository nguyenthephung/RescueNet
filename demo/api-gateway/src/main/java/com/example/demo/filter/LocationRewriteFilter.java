package com.example.demo.filter;

import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Rewrite Location header on 3xx responses from downstream services so redirects
 * go through the API gateway (same origin) instead of directing the browser to
 * the backend host (which would trigger CORS errors).
 */
@Component
public class LocationRewriteFilter implements GlobalFilter, Ordered {

    // Downstream base (backend) and gateway mapping. Adjust if your gateway host/port differ.
    private static final String DOWNSTREAM_BASE = "http://localhost:8084";
    private static final String GATEWAY_BASE = "http://localhost:8888/api/v1";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            if (response.getStatusCode() != null && response.getStatusCode().is3xxRedirection()) {
                HttpHeaders headers = response.getHeaders();
                List<String> locations = headers.get(HttpHeaders.LOCATION);
                if (locations != null && !locations.isEmpty()) {
                    // If the downstream redirect points to a login page, convert it to 401
                    boolean loginRedirect = locations.stream().anyMatch(loc -> loc.contains("/login") || loc.contains(";jsessionid"));
                    if (loginRedirect) {
                        // Remove Location header and set status to 401 so browser/client receives JSON-style auth error
                        headers.remove(HttpHeaders.LOCATION);
                        response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    } else {
            List<String> rewritten = locations.stream()
                .map(loc -> loc.replace(DOWNSTREAM_BASE, GATEWAY_BASE))
                .toList();
                        headers.put(HttpHeaders.LOCATION, rewritten);
                    }
                }
            }
        }));
    }

    @Override
    public int getOrder() {
        // run late in the chain
        return Ordered.LOWEST_PRECEDENCE;
    }
}
