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
    const response = await apiClient.post('/identity/auth/login', {
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
      
      // Fetch actual user info after successful login
      let user: User;
      try {
        user = await getMyInfo();
      } catch (error) {
        // Fallback to basic user info if getMyInfo fails
        console.warn('Failed to fetch user info, using fallback:', error);
        user = {
          id: 'temp',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          fullName: credentials.email,
          role: 'citizen',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Return in expected format
      return {
        success: true,
        token: data.result.token,
        refreshToken: data.result.refreshToken,
        expiresIn: data.result.expiresIn,
        message: data.message || 'Login successful',
        user
      };
    }

    throw new Error('Invalid response from server');
  } catch (error: unknown) {
    console.error('Login error:', error);
    
    // Handle backend error response structure
    const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
    const errorMessage = axiosError.response?.data?.message 
      || axiosError.response?.data?.error 
      || axiosError.message 
      || 'Login failed';
    
    throw new Error(errorMessage);
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

    const response = await fetch(`${API_BASE_URL}/identity/users/register`, {
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
    const response = await fetch(`${API_BASE_URL}/identity/auth/verify`, {
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
    const response = await fetch(`${API_BASE_URL}/identity/auth/resend-code`, {
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
      await fetch(`${API_BASE_URL}/identity/auth/logout`, {
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
    tokenManager.clearTokens();
  }
}

/**
 * Get current user info from backend
 */
export async function getMyInfo(): Promise<User> {
  try {
    const response = await apiClient.get('/identity/users/my-info');
    
    const data = response.data;
    
    // Backend returns: { code, message, result: UserResponse }
    if (data.result) {
      const userResponse = data.result;
      
      // Map backend UserResponse to frontend User type
      const user: User = {
        id: userResponse.userId?.toString() || '',
        email: userResponse.email || '',
        name: userResponse.fullName || '',
        fullName: userResponse.fullName || '',
        role: userResponse.roles?.[0]?.name?.toLowerCase() || 'citizen',
        createdAt: userResponse.createdAt || new Date().toISOString(),
        updatedAt: userResponse.createdAt || new Date().toISOString(),
      };
      
      return user;
    }
    
    throw new Error('Invalid response from server');
  } catch (error: unknown) {
    console.error('Get my info error:', error);
    throw error;
  }
}

/**
 * Get current user from token
 * @deprecated Use getMyInfo() instead for up-to-date user information
 */
export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/identity/auth/introspect`, {
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
      // Use getMyInfo instead for full user data
      return getMyInfo();
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

