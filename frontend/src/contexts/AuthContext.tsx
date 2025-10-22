/**
 * Authentication Context
 * Global authentication state management
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginCredentials, RegisterData, VerificationData } from '@/types';
import * as authApi from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<User>;
  register: (data: RegisterData) => Promise<{ requiresVerification: boolean }>;
  verifyEmail: (data: VerificationData) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials, rememberMe: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        
        // Save to localStorage if remember me
        if (rememberMe) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_user', JSON.stringify(response.user));
        } else {
          // Save to sessionStorage instead
          sessionStorage.setItem('auth_token', response.token);
          sessionStorage.setItem('auth_user', JSON.stringify(response.user));
        }
        
        return response.user;
      }
      
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      return { requiresVerification: response.requiresVerification || false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (data: VerificationData) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyEmail(data);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendCode = useCallback(async (email: string) => {
    await authApi.resendVerificationCode(email);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        verifyEmail,
        resendCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
