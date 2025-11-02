package com.example.demo.configuration;

import com.example.demo.repository.AuthClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;


@Configuration
public class WebClientConfig {
    @Bean
    WebClient webClient(){
        return WebClient.builder()

                .baseUrl("http://localhost:8080/identity")
                .build();
    }
    @Bean

    AuthClient authClient(WebClient webClient){
        HttpServiceProxyFactory httpServiceProxyFactory =HttpServiceProxyFactory.builderFor(WebClientAdapter.create(webClient)).build();
        return httpServiceProxyFactory.createClient(AuthClient.class);
    }
}
