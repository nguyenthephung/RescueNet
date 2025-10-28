/**
 * Chat API Service
 * Handles guest token, chat messages, WebSocket auth
 */

import type { GuestTokenResponse, ChatMessage } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get or create guest token for anonymous users
 * Token stored in localStorage with expiry
 */
export async function getGuestToken(): Promise<GuestTokenResponse> {
  // Check if valid token exists in localStorage
  const stored = localStorage.getItem('guest_token_data');
  if (stored) {
    const data: GuestTokenResponse = JSON.parse(stored);
    const expiresAt = new Date(data.expiresAt).getTime();
    const now = Date.now();
    
    // Return existing token if not expired (with 5 min buffer)
    if (expiresAt - now > 5 * 60 * 1000) {
      console.log('[Chat] Using cached guest token:', data.guestId);
      return data;
    }
  }

  // Request new token from backend
  await delay(500);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/chat/guest-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get guest token');
  }
  
  const data: GuestTokenResponse = await response.json();
  */

  // Mock response
  const guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  
  const data: GuestTokenResponse = {
    token: 'mock_jwt_token_' + guestId,
    guestId,
    expiresAt
  };

  console.log('[MOCK] Created guest token:', data);
  console.log('[INFO] Backend TODO: Generate JWT with guest_id, expiry 1 hour');
  
  // Store in localStorage
  localStorage.setItem('guest_token_data', JSON.stringify(data));
  
  return data;
}

/**
 * Get authentication token for WebSocket
 * Returns guest token for anonymous, user token for authenticated
 */
export async function getChatAuthToken(userId?: string, userToken?: string): Promise<string> {
  if (userId && userToken) {
    // Authenticated user - use existing auth token
    console.log('[Chat] Using user auth token');
    return userToken;
  }
  
  // Anonymous user - get guest token
  const guestData = await getGuestToken();
  return guestData.token;
}

/**
 * Send chat message via HTTP (fallback if WebSocket fails)
 */
export async function sendChatMessage(data: {
  incidentId: string;
  message: string;
  senderId: string;
  senderType: 'victim' | 'responder';
  token: string;
}): Promise<ChatMessage> {
  await delay(300);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`
    },
    body: JSON.stringify({
      incidentId: data.incidentId,
      message: data.message,
      senderType: data.senderType
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
  */

  console.log('[MOCK] Sending chat message:', data);

  const message: ChatMessage = {
    id: 'msg_' + Date.now(),
    incidentId: data.incidentId,
    senderId: data.senderId,
    senderType: data.senderType,
    senderName: data.senderType === 'victim' ? 'You' : 'Responder',
    message: data.message,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };

  return message;
}

/**
 * Get chat history for an incident
 */
export async function getChatHistory(
  incidentId: string, 
  token: string
): Promise<ChatMessage[]> {
  await delay(500);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/chat/history/${incidentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  
  return response.json();
  */

  console.log('[MOCK] Fetching chat history for incident:', incidentId);

  // Mock history
  return [
    {
      id: 'msg_system_1',
      incidentId,
      senderId: 'system',
      senderType: 'system',
      senderName: 'RescueNet',
      message: 'Emergency chat initiated. A responder will join shortly.',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      status: 'sent'
    }
  ];
}

/**
 * Clear guest token (logout)
 */
export function clearGuestToken() {
  localStorage.removeItem('guest_token_data');
  console.log('[Chat] Guest token cleared');
}
