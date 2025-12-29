package com.example.demo.mapper;


import com.example.demo.dto.request.IncidentRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.IncidentResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.Incident;
import com.example.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IncidentMapper {
    @Mapping(target = "incidentId", ignore = true) // ID do DB tự sinh
    @Mapping(target = "createdAt", ignore = true)  // gán thủ công sau
    Incident toIncident(IncidentRequest request);
    IncidentResponse toIncidentResponse(Incident incident);
}


