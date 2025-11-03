package service;

import model.RescueAssignment;
import model.UserLocation;
import repository.RedisAssignmentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RescueTeamService {

    // map of teamId -> session (active dashboards)
    private final ConcurrentHashMap<String, WebSocketSession> teamSessions = new ConcurrentHashMap<>();

    private final RedisAssignmentRepository assignmentRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public RescueTeamService(RedisAssignmentRepository assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }

    public void registerTeam(String teamId, WebSocketSession session) {
        if (teamId == null || teamId.isEmpty()) return;
        teamSessions.put(teamId, session);
    }

    public void unregisterTeam(String teamId) {
        if (teamId == null) return;
        teamSessions.remove(teamId);
    }

    public WebSocketSession getSessionForTeam(String teamId) {
        return teamSessions.get(teamId);
    }

    public void assignRescue(String teamId, String userId) {
        RescueAssignment assignment = new RescueAssignment(userId, teamId, Instant.now());
        assignmentRepo.save(assignment);
    }

    public RescueAssignment findAssignmentForUser(String userId) {
        return assignmentRepo.findByUserId(userId);
    }

    public void unassign(String userId) {
        assignmentRepo.deleteByUserId(userId);
    }

    // send a payload (object) to a specific team if connected
    public void sendToTeam(String teamId, Object payload) {
        try {
            WebSocketSession session = teamSessions.get(teamId);
            if (session != null && session.isOpen()) {
                String json = mapper.writeValueAsString(payload);
                session.sendMessage(new TextMessage(json));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public ConcurrentHashMap<String, WebSocketSession> getSessionForTeamMap() {
        return teamSessions;
    }
}
