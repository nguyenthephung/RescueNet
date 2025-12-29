package com.example.demo.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.demo.dto.request.ConversationRequest;
import com.example.demo.dto.response.ConversationResponse;
//import com.example.demo.model.Conversation;
import com.example.demo.model.Conversation;
import com.example.demo.model.ParticipantInfo;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.ConversationMapper;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationService {
    ConversationRepository conversationRepository;
    ProfileClient profileClient;

    ConversationMapper conversationMapper;

    public List<ConversationResponse> myConversations() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Conversation> conversations = conversationRepository.findAllByParticipantusernameContains(userId);

        return conversations.stream().map(this::toConversationResponse).toList();
    }

    public ConversationResponse create(ConversationRequest request) {
        // Fetch user infos
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Creating conversation for userId={}, with participantIds={}", userId, request.getParticipantIds().getFirst());
        var userInfoResponse = profileClient.getProfile(userId);
        var participantInfoResponse = profileClient.getProfile(
                request.getParticipantIds().getFirst());

        if (Objects.isNull(userInfoResponse) || Objects.isNull(participantInfoResponse)) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        var userInfo = userInfoResponse.getResult();
        var participantInfo = participantInfoResponse.getResult();
        List<String> userIds = new ArrayList<>();
        userIds.add(userId);
        log.info("(participantInfo: {}",String.valueOf(participantInfo));
        log.info("(participantInfo.getUserId(): {}",participantInfo.getUsername());

        userIds.add(participantInfo.getUsername());

        var sortedIds = userIds.stream().sorted().toList();
        String userIdHash = generateParticipantHash(Collections.singletonList(String.valueOf(sortedIds)));
        var conversation = conversationRepository.findByParticipantsHash(userIdHash)
                .orElseGet(()->{
                    List<ParticipantInfo> participantInfos = List.of(
                            ParticipantInfo.builder()
//                        .userId(String.valueOf(userInfo.getUserId()))
                                    .username(userInfo.getUsername())
                                    .firstName(userInfo.getFirstName())
                                    .lastName(userInfo.getLastName())
//                        .avatar(userInfo.getAvatar())
                                    .build(),
                            ParticipantInfo.builder()
//                        .userId(String.valueOf(participantInfo.getUserId()))
                                    .username(participantInfo.getUsername())
                                    .firstName(participantInfo.getFirstName())
                                    .lastName(participantInfo.getLastName())
//                        .avatar(participantInfo.getAvatar())
                                    .build()
                    );

                    // Build conversation info
                    Conversation newConversation = Conversation.builder()
                            .type(request.getType())
                            .participantsHash(userIdHash)
                            .createdDate(Instant.now())
                            .modifiedDate(Instant.now())
                            .participants(participantInfos)
                            .build();

                    return conversationRepository.save(newConversation);

                });


        return toConversationResponse(conversation);
    }

    private String generateParticipantHash(List<String> ids) {
        StringJoiner stringJoiner = new StringJoiner("_");
        ids.forEach(stringJoiner::add);

        // SHA 256

        return stringJoiner.toString();
    }

    private ConversationResponse toConversationResponse(Conversation conversation) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();

        ConversationResponse conversationResponse = conversationMapper.toConversationResponse(conversation);

        conversation.getParticipants().stream()
                .filter(participantInfo -> !participantInfo.getUsername().equals(currentUserId))
                .findFirst().ifPresent(participantInfo -> {
                    conversationResponse.setConversationName(participantInfo.getUsername());
//                    conversationResponse.setConversationAvatar(participantInfo.getAvatar());
                });

        return conversationResponse;
    }
}