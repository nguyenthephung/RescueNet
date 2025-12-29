package com.example.demo.repository;

import com.example.demo.model.WebSocketSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WebSocketSessionRepository extends MongoRepository<WebSocketSession,String> {
    void deleteBySocketSessionId(String socketId);
    List<WebSocketSession> findAllByUserIdIn(List<String> us);
}
