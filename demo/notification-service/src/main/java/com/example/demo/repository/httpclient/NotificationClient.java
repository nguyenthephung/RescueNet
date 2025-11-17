package com.example.demo.repository.httpclient;


import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "notification-service", url = "${app.services.notification}")
public interface NotificationClient {
//    @PostMapping(value = "/internal/create", produces = MediaType.APPLICATION_JSON_VALUE)
//    ProfileUserResponse createProfile(@RequestBody ProfileCreationRequest request);
}
