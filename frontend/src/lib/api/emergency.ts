/**
 * Emergency API Service
 * Handles SOS requests, rate limiting, verification
 */

import type { 
  EmergencyRequest, 
  IncidentType, 
  EmergencyLocation,
  RateLimitInfo,
  PhoneVerificationData,
  VerificationLevel 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check rate limit before sending SOS
 * Returns rate limit info for the device/user
 */
export async function checkRateLimit(deviceId: string, userId?: string): Promise<RateLimitInfo> {
  await delay(300);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/rate-limit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, userId })
  });
  return response.json();
  */

  // Mock: Check local storage for rate limiting
  const storageKey = `rate_limit_${deviceId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    const data = JSON.parse(stored);
    const now = new Date().getTime();
    const resetTime = new Date(data.resetAt).getTime();
    
    if (now < resetTime) {
      return {
        requestCount: data.requestCount,
        lastRequestAt: data.lastRequestAt,
        cooldownUntil: data.cooldownUntil,
        isBlocked: data.requestCount >= (userId ? 5 : 2), // Authenticated: 5, Anonymous: 2
        remainingRequests: Math.max(0, (userId ? 5 : 2) - data.requestCount),
        resetAt: data.resetAt
      };
    }
  }

  // No limit or expired
  const resetAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  return {
    requestCount: 0,
    lastRequestAt: null,
    cooldownUntil: null,
    isBlocked: false,
    remainingRequests: userId ? 5 : 2,
    resetAt
  };
}

/**
 * Send SOS emergency request
 */
export async function sendSOS(data: {
  incidentType: IncidentType;
  location: EmergencyLocation;
  description?: string;
  mediaUrls?: string[];
  verificationLevel: VerificationLevel;
  deviceId: string;
  userId?: string;
  phoneNumber?: string;
}): Promise<EmergencyRequest> {
  await delay(1500);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/sos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(data.userId && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to send SOS');
  }
  
  return response.json();
  */

  // Mock response
  console.log('[MOCK] Sending SOS to backend:', data);

  // Update rate limit in localStorage
  const storageKey = `rate_limit_${data.deviceId}`;
  const stored = localStorage.getItem(storageKey);
  const rateData = stored ? JSON.parse(stored) : { requestCount: 0, resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
  
  rateData.requestCount += 1;
  rateData.lastRequestAt = new Date().toISOString();
  localStorage.setItem(storageKey, JSON.stringify(rateData));

  // Determine priority based on verification level
  const priorityMap: Record<VerificationLevel, 'low' | 'normal' | 'high' | 'critical'> = {
    0: 'low',
    1: 'normal',
    2: 'high'
  };

  const emergencyRequest: EmergencyRequest = {
    id: 'sos_' + Date.now(),
    userId: data.userId,
    incidentType: data.incidentType,
    description: data.description,
    location: data.location,
    mediaUrls: data.mediaUrls,
    verificationLevel: data.verificationLevel,
    status: 'sent',
    priority: priorityMap[data.verificationLevel],
    deviceId: data.deviceId,
    phoneNumber: data.phoneNumber,
    eta: data.verificationLevel === 2 ? 5 : data.verificationLevel === 1 ? 10 : 15, // minutes
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return emergencyRequest;
}

/**
 * Cancel SOS request
 * Applies rate limit penalty (deducts 1 usage)
 */
export async function cancelSOS(sosId: string): Promise<{ success: boolean; message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/sos/${sosId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
  */

  console.log('[MOCK] Cancelling SOS:', sosId);

  // Apply rate limit penalty: deduct 1 usage (but don't increase requestCount)
  // In production, backend should handle this
  const deviceId = localStorage.getItem('device_id') || 'device_unknown';
  const storageKey = `rate_limit_${deviceId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    const rateData = JSON.parse(stored);
    // Penalty: Mark as if user made a request (this reduces remaining requests)
    rateData.requestCount += 1;
    rateData.lastRequestAt = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(rateData));
    console.log('[MOCK] Rate limit penalty applied. Request count:', rateData.requestCount);
  }

  return {
    success: true,
    message: 'SOS request cancelled. Rate limit penalty applied.'
  };
}

/**
 * Get SOS status
 */
export async function getSOSStatus(sosId: string): Promise<EmergencyRequest> {
  await delay(500);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/sos/${sosId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  */

  // Mock: simulate status updates
  const mockStatuses: EmergencyRequest['status'][] = ['sent', 'assigned', 'on_route', 'arrived'];
  const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

  return {
    id: sosId,
    incidentType: 'medical',
    location: { latitude: 0, longitude: 0 },
    verificationLevel: 1,
    status: randomStatus,
    priority: 'high',
    eta: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Verify phone number with OTP
 */
export async function verifyPhoneOTP(data: PhoneVerificationData): Promise<{ 
  success: boolean; 
  message: string;
  verificationLevel: VerificationLevel;
}> {
  await delay(1000);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/verify-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
  */

  console.log('[MOCK] Verifying phone:', data.phoneNumber, 'with code:', data.code);

  if (data.code.length === 6 && /^\d+$/.test(data.code)) {
    return {
      success: true,
      message: 'Phone verified successfully',
      verificationLevel: 1
    };
  }

  throw new Error('Invalid OTP code');
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  await delay(800);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  return response.json();
  */

  console.log('[MOCK] Sending OTP to:', phoneNumber);

  return {
    success: true,
    message: 'OTP sent to your phone'
  };
}

/**
 * Verify CAPTCHA token
 */
export async function verifyCaptcha(token: string): Promise<{ success: boolean; message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/verify-captcha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return response.json();
  */

  console.log('[MOCK] Verifying CAPTCHA token:', token);

  return {
    success: true,
    message: 'CAPTCHA verified'
  };
}

/**
 * Get user's emergency history
 */
export async function getEmergencyHistory(userId: string): Promise<EmergencyRequest[]> {
  await delay(800);
  
  // TODO: Replace with actual API call
  /*
  const response = await fetch(`${API_BASE_URL}/emergency/history/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
  */

  // Mock empty history
  return [];
}

/**
 * Update "I'm OK" status
 */
export async function updateImOkay(sosId: string): Promise<{ success: boolean; message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  console.log('[MOCK] User marked as OK for SOS:', sosId);

  return {
    success: true,
    message: 'Status updated: You are okay'
  };
}
