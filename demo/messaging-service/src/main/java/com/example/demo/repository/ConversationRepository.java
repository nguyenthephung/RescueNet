package com.example.demo.repository;

import com.example.demo.model.Conversation;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    // Return all conversations for a given participant userId
    @Query("{'participants.username' : ?0}")
    List<Conversation> findAllByParticipantusernameContains(String username);

    // Return one conversation by participantsHash
    @Query("{'participantsHash' : ?0}")
    Optional<Conversation> findByParticipantsHash(String participantsHash);
}
