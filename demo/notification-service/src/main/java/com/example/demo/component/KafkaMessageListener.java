package com.example.demo.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@KafkaListener(topics = "sos-topic", groupId = "notification-group")
public class KafkaMessageListener {

    @KafkaHandler
    public void handleString(String message) {
        log.info("📥 Received: {}", message);
    }

    @KafkaHandler(isDefault = true)
    public void handleDefault(Object obj) {
        log.warn("⚠️ Unknown message type: {}", obj);
    }
}

