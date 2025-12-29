package com.example.demo.config;
import jakarta.websocket.Endpoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // Endpoint để FE connect (SockJS fallback optional)
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // ws://host/ws
                .setAllowedOriginPatterns("*")
                .withSockJS();      // dùng SockJS fallback (tuỳ chọn)
    }

    // Prefix định tuyến và topic đẩy ra cho FE
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Broker nội bộ dành cho push từ server → client
        registry.enableSimpleBroker("/topic", "/queue");

        // Client gửi message lên server (nếu cần), sẽ đi qua prefix /app
        registry.setApplicationDestinationPrefixes("/app");
    }
}
