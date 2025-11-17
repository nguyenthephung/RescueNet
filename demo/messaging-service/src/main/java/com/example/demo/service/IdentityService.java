package com.example.demo.service;

import com.example.demo.dto.request.IntrospectRequest;
import com.example.demo.dto.response.IntrospectResponse;
import com.example.demo.repository.httpclient.IdentityClient;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IdentityService {
    IdentityClient identityClient;

    public IntrospectResponse introspect(IntrospectRequest request){
        try {
            var result = identityClient.introspect(request).getResult();
            if(Objects.isNull(result)){
                return IntrospectResponse.builder()
                        .valid(false)
                        .build();
            }
            return result;
        }catch (FeignException e){
            log.error("Introspect failer");
            return IntrospectResponse.builder()
                    .valid(false)
                    .build();
        }
    }
}
