package com.example.demo.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.core.KafkaOperations;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;


public class KafkaConfig {
    @Bean
    public CommonErrorHandler errorHandler(KafkaOperations<Object,Object> template){
        return new DefaultErrorHandler(new DeadLetterPublishingRecoverer(template), new FixedBackOff(1000,2));
    }
    @Bean
    public NewTopic insertTestMessageTopic(){
        return new NewTopic("sos-topic", 1,(short) 1);
    }

}
