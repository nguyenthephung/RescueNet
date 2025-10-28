/**
 * WebSocket Chat Hook
 * Manages real-time chat connection using Socket.io
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';

// TODO: Install socket.io-client: npm install socket.io-client
// import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface UseChatSocketProps {
  incidentId: string;
  authToken: string;
  senderId: string;
  senderType: 'victim' | 'responder';
  onMessageReceived?: (message: ChatMessage) => void;
}

interface UseChatSocketReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  typingUser: string | null;
  error: string | null;
  sendMessage: (text: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export function useChatSocket({
  incidentId,
  authToken,
  senderId,
  senderType,
  onMessageReceived
}: UseChatSocketProps): UseChatSocketReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store socket instance
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('[Chat] Initializing WebSocket connection');
    console.log('[INFO] TODO: Install socket.io-client package');
    
    // Mock connection for now
    const mockConnect = () => {
      console.log('[MOCK] WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // Simulate receiving welcome message
      setTimeout(() => {
        const welcomeMsg: ChatMessage = {
          id: 'msg_welcome',
          incidentId,
          senderId: 'system',
          senderType: 'system',
          senderName: 'RescueNet',
          message: 'Chat connected. Responder will join soon.',
          timestamp: new Date().toISOString(),
          status: 'sent'
        };
        setMessages(prev => [...prev, welcomeMsg]);
        onMessageReceived?.(welcomeMsg);
      }, 1000);
    };

    // Simulate connection with delay
    const connectTimer = setTimeout(mockConnect, 500);

    /* TODO: Replace with actual Socket.io connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token: authToken },
      query: { 
        incidentId,
        senderId,
        senderType
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('[Chat] WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // Join incident room
      socket.emit('join-incident', { incidentId });
    });

    socket.on('disconnect', () => {
      console.log('[Chat] WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (err: Error) => {
      console.error('[Chat] Connection error:', err);
      setError('Connection failed. Retrying...');
      setIsConnected(false);
    });

    // Message events
    socket.on('message', (message: ChatMessage) => {
      console.log('[Chat] Message received:', message);
      setMessages(prev => [...prev, message]);
      onMessageReceived?.(message);
    });

    socket.on('message-status', (data: { messageId: string; status: ChatMessage['status'] }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, status: data.status }
          : msg
      ));
    });

    // Typing events
    socket.on('typing-start', (data: { userId: string; userName: string }) => {
      if (data.userId !== senderId) {
        setIsTyping(true);
        setTypingUser(data.userName);
      }
    });

    socket.on('typing-stop', () => {
      setIsTyping(false);
      setTypingUser(null);
    });

    // Cleanup
    return () => {
      console.log('[Chat] Disconnecting WebSocket');
      socket.disconnect();
    };
    */

    return () => {
      clearTimeout(connectTimer);
      console.log('[MOCK] WebSocket cleanup');
    };
  }, [incidentId, authToken, senderId, senderType, onMessageReceived]);

  // Send message
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const tempMessage: ChatMessage = {
      id: 'temp_' + Date.now(),
      incidentId,
      senderId,
      senderType,
      senderName: 'You',
      message: text,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    // Optimistically add message
    setMessages(prev => [...prev, tempMessage]);

    console.log('[MOCK] Sending message:', text);

    // Simulate message sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, id: 'msg_' + Date.now(), status: 'sent' }
          : msg
      ));
    }, 500);

    /* TODO: Replace with actual socket emit
    if (socketRef.current?.connected) {
      socketRef.current.emit('send-message', {
        incidentId,
        message: text,
        tempId: tempMessage.id
      });
    } else {
      // Fallback to HTTP if WebSocket disconnected
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, status: 'failed' }
          : msg
      ));
      setError('Not connected. Message failed.');
    }
    */
  }, [incidentId, senderId, senderType]);

  // Start typing indicator
  const startTyping = useCallback(() => {
    console.log('[MOCK] User typing...');
    
    /* TODO: Replace with actual socket emit
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing-start', { incidentId });
    }
    */
  }, [incidentId]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    console.log('[MOCK] User stopped typing');
    
    /* TODO: Replace with actual socket emit
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing-stop', { incidentId });
    }
    */
  }, [incidentId]);

  return {
    messages,
    isConnected,
    isTyping,
    typingUser,
    error,
    sendMessage,
    startTyping,
    stopTyping
  };
}
