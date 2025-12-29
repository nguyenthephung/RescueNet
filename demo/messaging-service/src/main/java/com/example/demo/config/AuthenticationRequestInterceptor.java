package com.example.demo.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Slf4j
public class AuthenticationRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes servletRequestAttributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String authHeader = resolveAuthHeader(servletRequestAttributes);

        log.info("Forwarding Authorization header for Feign: {}", (authHeader != null) ? "[present]" : "[absent]");
        if (StringUtils.hasText(authHeader)) {
            template.header("Authorization", authHeader);
        }
    }

    private String resolveAuthHeader(ServletRequestAttributes servletRequestAttributes) {
        String authHeader = null;
        if (servletRequestAttributes != null && servletRequestAttributes.getRequest() != null) {
            authHeader = servletRequestAttributes.getRequest().getHeader("Authorization");
        }

        if (StringUtils.hasText(authHeader)) {
            return authHeader;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            String tokenValue = jwtAuth.getToken().getTokenValue();
            if (StringUtils.hasText(tokenValue)) {
                return "Bearer " + tokenValue;
            }
        } else if (authentication != null && authentication.getCredentials() instanceof String) {
            String creds = (String) authentication.getCredentials();
            if (StringUtils.hasText(creds)) {
                return creds.startsWith("Bearer") ? creds : "Bearer " + creds;
            }
        }

        return null;
    }
}