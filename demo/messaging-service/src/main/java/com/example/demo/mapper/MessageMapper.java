package com.example.demo.mapper;

import com.example.demo.dto.request.MessageRequest;
import com.example.demo.dto.response.MessageResponse;
import com.example.demo.model.Message;
import org.mapstruct.Mapper;

import java.util.List;
@Mapper(componentModel = "spring")
public interface MessageMapper {
    MessageResponse toChatMessageResponse(Message chatMessage);

    Message toChatMessage(MessageRequest request);

    List<MessageResponse> toChatMessageResponses(List<Message> chatMessages);
}
