/**
 * Authentication API Service
 * Connects to backend API Gateway
 */

import type { LoginCredentials, RegisterData, VerificationData, AuthResponse, User } from '@/types';
import apiClient, { tokenManager } from './apiClient';

// API Gateway base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1';

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post('/auth/login', {
      fullName: credentials.email, // Backend expects 'fullName' field
      passwordHash: credentials.password
    });

    const data = response.data;
    
    // Backend returns: { code, message, result: { token, refreshToken, expiresIn, authenticated } }
    if (data.result && data.result.token) {
      // Store tokens using tokenManager
      tokenManager.setTokens(
        data.result.token,
        data.result.refreshToken,
        data.result.expiresIn
      );
      
      // Return in expected format
      return {
        success: true,
        token: data.result.token,
        refreshToken: data.result.refreshToken,
        message: data.message || 'Login successful',
        user: {
          id: 'temp', // Will be fetched from token introspection
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'citizen', // Default role, will be updated after introspection
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };
    }

    throw new Error('Invalid response from server');
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
}

/**
 * Register new user
 * Backend flow:
 * 1. Frontend sends registration data
 * 2. Backend creates user account
 * 3. Backend returns success
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    // Map frontend data to backend format
    const backendRequest = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      passwordHash: data.password, // Backend expects 'passwordHash' field
      firstName: data.fullName.split(' ')[0] || data.fullName,
      lastName: data.fullName.split(' ').slice(1).join(' ') || ''
    };

    console.log('Sending registration request:', backendRequest);

    const response = await fetch(`${API_BASE_URL}/auth/users/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(backendRequest)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        code: 9999,
        message: 'Registration failed - Unable to parse error response' 
      }));
      
      console.error('Backend error response:', error);
      console.error('Request sent:', backendRequest);
      console.error('Response status:', response.status);
      
      const errorMessage = error.message || `Registration failed (Error code: ${error.code || 'unknown'})`;
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    // Backend successfully created user and sent OTP
    return {
      success: true,
      requiresVerification: true, // Always require verification
      message: result.message || 'Registration successful. Please check your email for verification code.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Verify phone number with code
 * Frontend sends user-entered code to backend for validation
 * Backend validates code and activates user account
 */
export async function verifyEmail(data: VerificationData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
        code: data.code
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Verification failed' }));
      throw new Error(error.message || 'Verification failed');
    }
    
    const result = await response.json();
    
    // After successful verification, user still needs to login
    return {
      success: true,
      message: result.result || 'Email verified successfully. You can now login.',
    };
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
}

/**
 * Resend verification code
 * Backend generates new code and sends via SMS
 */
export async function resendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to resend code' }));
      throw new Error(error.message || 'Failed to resend code');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: result.result || 'New verification code sent to your email',
    };
  } catch (error) {
    console.error('Resend code error:', error);
    throw error;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API call result
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/introspect`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    const data = await response.json();
    
    // Backend returns introspection result
    if (data.result && data.result.valid) {
      // Get user info from stored data or token claims
      const user = localStorage.getItem('auth_user');
      if (user) {
        return JSON.parse(user);
      }
    }
    
    throw new Error('Invalid token');
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send reset email' }));
      throw new Error(error.message || 'Failed to send reset email');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: result.message || 'Password reset email sent',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

// Alias for backward compatibility
export const resendCode = resendVerificationCode;

