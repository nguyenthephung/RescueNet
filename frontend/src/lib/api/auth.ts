/**
 * Authentication API Service
 * Mock API calls for authentication (backend not implemented yet)
 */

import type { LoginCredentials, RegisterData, VerificationData, AuthResponse, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(1000);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(credentials)
  // });
  // return response.json();

  // Mock response
  if (credentials.email === 'admin@rescue.net' && credentials.password === 'admin123') {
    return {
      success: true,
      user: {
        id: '1',
        email: credentials.email,
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock_admin_token_' + Date.now(),
      message: 'Login successful',
    };
  }

  throw new Error('Invalid credentials');
}

/**
 * Register new user
 * Backend flow:
 * 1. Frontend sends registration data
 * 2. Backend validates and sends verification code via SMS to phone
 * 3. Backend returns success with requiresVerification flag
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  await delay(1500);
  
  // TODO: Replace with actual API call
  // Expected backend behavior:
  // - Validate registration data
  // - Create pending user in database
  // - Generate 6-digit verification code
  // - Send SMS to data.phone with verification code
  // - Return { success: true, requiresVerification: true }
  
  /*
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return response.json();
  */

  // Mock response - simulate backend sending SMS
  console.log('[MOCK] Backend would send SMS verification code to:', data.phone);
  
  return {
    success: true,
    requiresVerification: true,
    message: 'Verification code sent to your phone number',
  };
}

/**
 * Verify phone number with code
 * Frontend sends user-entered code to backend for validation
 * Backend validates code and activates user account
 */
export async function verifyEmail(data: VerificationData): Promise<AuthResponse> {
  await delay(1000);
  
  // TODO: Replace with actual API call
  // Expected backend behavior:
  // - Receive verification code from frontend
  // - Check if code matches the one sent via SMS
  // - Check if code is not expired (usually 5-10 minutes validity)
  // - If valid: activate user account and return JWT token
  // - If invalid: return error
  
  /*
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data) // { email, code }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Verification failed');
  }
  
  return response.json();
  */

  // Mock response - accept any 6-digit code
  console.log('[MOCK] Frontend sending code to backend for validation:', data.code);
  
  if (data.code.length === 6 && /^\d+$/.test(data.code)) {
    return {
      success: true,
      user: {
        id: '2',
        email: data.email,
        name: 'New User',
        role: 'citizen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock_token_' + Date.now(),
      message: 'Phone verified successfully',
    };
  }

  throw new Error('Invalid verification code');
}

/**
 * Resend verification code
 * Backend generates new code and sends via SMS
 */
export async function resendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  await delay(800);
  
  // TODO: Replace with actual API call
  // Expected backend behavior:
  // - Generate new 6-digit verification code
  // - Invalidate old code
  // - Send new code via SMS to user's phone
  // - Return success response
  
  /*
  const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to resend code');
  }
  
  return response.json();
  */

  console.log('[MOCK] Backend would resend SMS code for:', email);
  
  return {
    success: true,
    message: 'New verification code sent to your phone',
  };
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // await fetch(`${API_BASE_URL}/auth/logout`, {
  //   method: 'POST',
  //   headers: { 
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // });

  // Clear local storage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

/**
 * Get current user from token
 */
export async function getCurrentUser(token: string): Promise<User> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/me`, {
  //   headers: { 'Authorization': `Bearer ${token}` }
  // });
  // return response.json();

  // Mock response
  const user = localStorage.getItem('auth_user');
  if (user) {
    return JSON.parse(user);
  }
  
  throw new Error('Not authenticated');
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  await delay(1000);
  
  // TODO: Replace with actual API call
  
  return {
    success: true,
    message: 'Password reset email sent',
  };
}
