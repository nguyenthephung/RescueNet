# Chat Feature Implementation

## 📋 Overview
Real-time chat system between victims and responders during emergency incidents.

## ✅ Completed (Phase 1 - Frontend)

### 1. Type Definitions (`types/index.ts`)
```typescript
- ChatMessage: Individual message structure
- ChatState: Redux state for chat
- GuestTokenResponse: Anonymous user authentication
```

### 2. API Layer (`lib/api/chat.ts`)
```typescript
- getGuestToken(): Get/create guest token (1-hour expiry)
- getChatAuthToken(): Unified auth for guest/user
- sendChatMessage(): HTTP fallback for WebSocket
- getChatHistory(): Load previous messages
- clearGuestToken(): Logout guest
```

**Guest Token Flow:**
1. Frontend requests `/guest-token` on page load
2. Backend returns JWT with `guest_id` (1-hour expiry)
3. Token stored in localStorage with expiry check
4. Token used for WebSocket authentication

### 3. WebSocket Hook (`hooks/useChatSocket.ts`)
```typescript
- Manages Socket.io connection
- Auto-reconnect on disconnect
- Typing indicators
- Message status updates
- Returns: { messages, isConnected, sendMessage, ... }
```

**TODO:** Install `socket.io-client` package:
```bash
npm install socket.io-client
```

### 4. UI Components (`features/chat/`)

#### ChatMessage.tsx
- Message bubbles (victim right, responder left, system center)
- Status indicators (⏳ sending, ✓ sent, ✓✓ delivered, ✓✓ read)
- Timestamp display
- Color-coded by sender type

#### ChatInput.tsx
- Auto-expanding textarea
- Send button (disabled when disconnected)
- Typing indicator (stops after 2s inactivity)
- Enter to send, Shift+Enter for new line

#### ChatWindow.tsx
- Header with connection status
- Auto-scroll to latest message
- Typing indicator animations
- Empty state message

### 5. Integration (`features/emergency/EmergencyStatus.tsx`)
- Chat window below emergency details
- Guest token auto-fetched for anonymous users
- WebSocket initialized with incident ID
- Supports 4 user states:
  * Anonymous (guest_id)
  * Phone-verified (guest_id + phone)
  * Logged in (user_id)
  * Logged + verified (user_id + phone)

### 6. i18n Translations (`lib/i18n.ts`)
```typescript
EN:
- chat.title: "Emergency Chat"
- chat.placeholder: "Type a message..."
- chat.send: "Send"
- chat.connected: "Connected"
- chat.disconnected: "Disconnected"
- chat.reconnecting: "Reconnecting..."
- chat.typingIndicator: "{user} is typing..."
- chat.noMessages: "No messages yet. Start the conversation!"
- chat.guestName: "Guest"
- chat.connecting: "Connecting..."
- chat.sendHint: "Press Enter to send, Shift+Enter for new line"

VI:
- chat.title: "Chat khẩn cấp"
- chat.placeholder: "Nhập tin nhắn..."
- chat.send: "Gửi"
- chat.connected: "Đã kết nối"
- chat.disconnected: "Mất kết nối"
- chat.reconnecting: "Đang kết nối lại..."
- chat.typingIndicator: "{user} đang nhập..."
- chat.noMessages: "Chưa có tin nhắn. Bắt đầu cuộc trò chuyện!"
- chat.guestName: "Khách"
- chat.connecting: "Đang kết nối..."
- chat.sendHint: "Nhấn Enter để gửi, Shift+Enter để xuống dòng"
```

## 🔧 Backend Requirements

### 1. Guest Token Endpoint
```typescript
POST /api/chat/guest-token
Response: {
  token: string;      // JWT with { guest_id, exp }
  guestId: string;    // "guest_abc123"
  expiresAt: string;  // ISO timestamp (1 hour)
}
```

### 2. WebSocket Server (Socket.io)
```typescript
// Authentication
socket.on('connection', (socket) => {
  const token = socket.handshake.auth.token;
  // Verify JWT (guest or user token)
  // Extract: guest_id OR user_id
});

// Events to handle
socket.on('join-incident', { incidentId });
socket.on('send-message', { incidentId, message, tempId });
socket.on('typing-start', { incidentId });
socket.on('typing-stop', { incidentId });

// Events to emit
socket.emit('message', { ...ChatMessage });
socket.emit('message-status', { messageId, status });
socket.emit('typing-start', { userId, userName });
socket.emit('typing-stop');
```

### 3. Database Schema
```sql
-- Chat messages table
CREATE TABLE chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  incident_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,        -- guest_id OR user_id
  sender_type ENUM('victim', 'responder', 'system'),
  sender_name VARCHAR(255),
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('sending', 'sent', 'delivered', 'read', 'failed'),
  FOREIGN KEY (incident_id) REFERENCES emergency_requests(id)
);

-- Optional: Chat attachments
CREATE TABLE chat_attachments (
  id VARCHAR(255) PRIMARY KEY,
  message_id VARCHAR(255) NOT NULL,
  type ENUM('image', 'video', 'location'),
  url TEXT NOT NULL,
  FOREIGN KEY (message_id) REFERENCES chat_messages(id)
);
```

## 🎯 User States Support

| State | Auth Method | Priority | Features |
|-------|-------------|----------|----------|
| **Anonymous** | Guest token | Low | Basic chat, no history |
| **Phone Verified** | Guest token + phone | Normal | Chat history, SMS alerts |
| **Logged In** | User token | Normal | Full account features |
| **Logged + Verified** | User token + phone | High | Priority support, full access |

## 🚀 Next Steps

### Phase 2: Backend Integration
1. [ ] Install Socket.io server (`socket.io`)
2. [ ] Create guest token generation endpoint
3. [ ] Set up WebSocket server with JWT auth
4. [ ] Implement message persistence
5. [ ] Add message status updates
6. [ ] Test with multiple connections

### Phase 3: Advanced Features
1. [ ] File attachments (images, videos)
2. [ ] Location sharing in chat
3. [ ] Read receipts
4. [ ] Message history pagination
5. [ ] Offline message queue
6. [ ] Push notifications
7. [ ] Chat transcript download

## 📝 Testing Checklist

### Frontend (Current)
- [x] Guest token generation mock
- [x] WebSocket connection mock
- [x] Message display (victim/responder/system)
- [x] Typing indicators
- [x] i18n translations (EN/VI)
- [x] Integration with EmergencyStatus
- [x] Auto-scroll to latest message
- [ ] Real WebSocket connection (after backend)

### Backend (Todo)
- [ ] Guest token JWT generation
- [ ] Token expiry validation
- [ ] WebSocket authentication
- [ ] Message broadcasting
- [ ] Typing indicator relay
- [ ] Message persistence
- [ ] Status updates (sent/delivered/read)
- [ ] Multi-room support (multiple incidents)

## 🛠️ Development Commands

```bash
# Install dependencies
npm install socket.io-client

# Run development server
npm run dev

# Test chat feature
# Navigate to: /emergency (after SOS activation)
```

## 📂 File Structure

```
Frontend/
  src/
    types/index.ts                    # +ChatMessage, ChatState, GuestTokenResponse
    lib/api/chat.ts                   # NEW: Chat API functions
    hooks/useChatSocket.ts            # NEW: WebSocket hook
    features/chat/
      ChatWindow.tsx                  # NEW: Main chat container
      ChatMessage.tsx                 # NEW: Message bubble
      ChatInput.tsx                   # NEW: Input component
      index.ts                        # NEW: Exports
    features/emergency/
      EmergencyStatus.tsx             # MODIFIED: +Chat integration
    lib/i18n.ts                       # MODIFIED: +Chat translations
```

## 🔍 Mock Behavior (Current)

Since backend is not ready, the frontend uses mock implementations:

1. **Guest Token**: Generated client-side (`mock_jwt_token_guest_abc123`)
2. **WebSocket**: Simulated connection after 500ms delay
3. **Messages**: Welcome message appears after 1s
4. **Send**: Optimistic UI update, status changes after 500ms
5. **Typing**: Console logs only

All mock code is marked with `// TODO: Replace with actual API call` comments.

## 🔐 Security Notes

- Guest tokens expire after 1 hour (enforced by backend JWT)
- localStorage cleared on token expiry
- WebSocket requires valid token (guest OR user)
- Rate limiting should be applied server-side
- Message content sanitization needed (XSS prevention)

## 📞 Support

For questions or issues:
- Check console logs for `[Chat]` and `[MOCK]` prefixes
- Verify token in localStorage: `guest_token_data`
- Test WebSocket connection status in UI header

---

**Status**: ✅ Frontend Complete (Mock) | ⏳ Backend Pending
**Last Updated**: 2024
