package com.example.demo.controller;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.example.demo.dto.request.IntrospectRequest;
import com.example.demo.model.WebSocketSession;
import com.example.demo.repository.httpclient.IdentityClient;
import com.example.demo.service.IdentityService;
import com.example.demo.service.WebSocketSessionService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.Socket;
import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SocketHandler {
    SocketIOServer socketIOServer;
    IdentityService identityService;
    WebSocketSessionService webSocketSessionService;
    @OnConnect
    public void clientConnected(SocketIOClient client){
        String token = client.getHandshakeData().getSingleUrlParam("token");
        var introspect = identityService.introspect(IntrospectRequest.builder()
                        .token(token)
                .build());
        if(introspect.isValid()) {
            log.info("Client connected: {}", client.getSessionId());
            WebSocketSession webSocketSession = WebSocketSession.builder()
                    .socketSessionId(client.getSessionId().toString())
                    .userId(introspect.getUserId())
                    .creatAt(Instant.now())
                    .build();
            webSocketSession = webSocketSessionService.create(webSocketSession);
            log.info("webSocketSession: {}",webSocketSession);

        }
        else {
            log.info("Authentication fail: {}", client.getSessionId());

        }
    }
    @OnDisconnect
    public void clientDisconnected(SocketIOClient client){
        log.info("Client disconnected: {}", client.getSessionId());
        webSocketSessionService.deleteSession(client.getSessionId().toString());
    }

    @PostConstruct
    public void start(){
        socketIOServer.start();
        socketIOServer.addListeners(this);
        log.info("Socket server stated");
    }

    @PreDestroy
    public  void stopServer(){
        socketIOServer.stop();
        log.info("Socket server stopped");

    }

}
