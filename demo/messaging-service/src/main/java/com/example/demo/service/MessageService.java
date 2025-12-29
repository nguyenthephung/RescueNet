package com.example.demo.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.demo.dto.request.MessageRequest;
import com.example.demo.dto.response.MessageResponse;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.MessageMapper;
import com.example.demo.model.Message;
import com.example.demo.model.ParticipantInfo;
import com.example.demo.model.WebSocketSession;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.WebSocketSessionRepository;
import com.example.demo.repository.httpclient.ProfileClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageService {
    SocketIOServer socketIOServer;

    MessageRepository chatMessageRepository;
    ConversationRepository conversationRepository;
    ProfileClient profileClient;

    MessageMapper chatMessageMapper;
    ObjectMapper objectMapper;
    WebSocketSessionRepository webSocketSessionRepository;
    public List<MessageResponse> getMessages(String conversationId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        var conversation =  conversationRepository.findById(conversationId)
                .orElseThrow(()->new AppException(ErrorCode.CONVERSATION_NOT_FOUND))
                .getParticipants()
                .stream()
                .filter(participantInfo -> userId.equals(participantInfo.getUsername()))
                .findAny().orElseThrow(()-> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        var userResponse = profileClient.getProfile(userId);

        var messages = chatMessageRepository.findAllByConversationIdOrderByCreatedDateDesc(conversationId);
        return  messages.stream().map(this::toChatMessageResponse).toList();

    }

    public MessageResponse create(MessageRequest request) throws JsonProcessingException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        var conversation =  conversationRepository.findById(request.getConversationId())
                .orElseThrow(()->new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        conversation.getParticipants()
                        .stream()
                        .filter(participantInfo -> userId.equals(participantInfo.getUsername()))
                        .findAny().orElseThrow(()-> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        var userResponse = profileClient.getProfile(userId);
        if(Objects.isNull(userResponse)){
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
        var userInfo = userResponse.getResult();

        Message message = chatMessageMapper.toChatMessage(request);
        message.setSender(ParticipantInfo.builder()
                .username(userInfo.getUsername())
                .firstName(userInfo.getFirstName())
                .lastName(userInfo.getLastName())
                .build());
        message.setCreatedDate(Instant.now());
        message = chatMessageRepository.save(message);

        List<String>userIds = conversation.getParticipants().stream().map(ParticipantInfo::getUsername).toList();

        Map<String,WebSocketSession> webSocketSessions =
                webSocketSessionRepository.findAllByUserIdIn(userIds).stream()
                                .collect(Collectors.toMap(WebSocketSession::getSocketSessionId,
                                        Function.identity()));
        MessageResponse messageResponse = chatMessageMapper.toChatMessageResponse(message);
        socketIOServer.getAllClients().forEach(client ->{
            var webSocketSession = webSocketSessions.get(client.getSessionId().toString());

                if(Objects.nonNull(webSocketSession)) {
                    String chatMessage = null;
                    try {
                        messageResponse.setMe(webSocketSession.getUserId().equals(userId));
                        chatMessage = objectMapper.writeValueAsString(messageResponse);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }

                    client.sendEvent("message", chatMessage);
                }
                });
        return toChatMessageResponse(message);
    }
    private MessageResponse toChatMessageResponse(Message chatMessage) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        var chatMessageResponse = chatMessageMapper.toChatMessageResponse(chatMessage);

        chatMessageResponse.setMe(userId.equals(chatMessage.getSender().getUsername()));

        return chatMessageResponse;
    }
}

