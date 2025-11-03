package websocket;

import model.Location;
import service.LocationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class LocationWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private LocationService locationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Convert JSON string to Location object
        Location location = objectMapper.readValue(message.getPayload(), Location.class);

        // Save to DB
        locationService.saveLocation(location);

        // Optional: send confirmation back to sender
        session.sendMessage(new TextMessage("Location received and saved"));
    }
}
