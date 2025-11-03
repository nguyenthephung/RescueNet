package websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.LocationRequest;
import model.UserLocation;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import service.LocationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RescueTeamWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private LocationService locationService;

    // store connected sessions (dashboard clients)
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String teamId = (String) session.getAttributes().get("teamId");
        sessions.put(teamId, session);
        log.info("Rescue team connected: {}", teamId);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // This can handle messages like {"action": "getLatest", "userId": "u123"}
        Map<String, Object> req = mapper.readValue(message.getPayload(), Map.class);
        String action = (String) req.get("action");

        if ("getLatest".equalsIgnoreCase(action)) {
            String userId = (String) req.get("userId");
            Optional<UserLocation> latest = locationService.getLatestLocation(userId);
            if (latest.isPresent()) {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(latest.get())));
            } else {
                session.sendMessage(new TextMessage("{\"error\":\"No location found\"}"));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.values().remove(session);
        log.info("Rescue team disconnected");
    }

    /**
     * Broadcast new victim location to all rescue teams
     */
    public void broadcastLocation(LocationRequest req) {
        try {
            String json = mapper.writeValueAsString(req);
            for (WebSocketSession session : sessions.values()) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        } catch (IOException e) {
            log.error("Failed to broadcast location", e);
        }
    }

    /**
     * Send location to a specific team (after they accept)
     */
    public void sendLocationToTeam(String teamId, UserLocation location) {
        WebSocketSession session = sessions.get(teamId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(location)));
                log.info("Sent location of {} to team {}", location.getUserId(), teamId);
            } catch (IOException e) {
                log.error("Error sending location to team {}", teamId, e);
            }
        } else {
            log.warn("Team {} not connected", teamId);
        }
    }
}
