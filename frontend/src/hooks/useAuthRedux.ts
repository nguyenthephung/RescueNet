/**
 * Redux-based Auth Hook
 * Replacement for useAuth from AuthContext
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  loginAsync, 
  registerAsync, 
  verifyEmailAsync, 
  resendCodeAsync, 
  logoutAsync,
  clearError 
} from '@/store/slices/authSlice';
import type { LoginCredentials, RegisterData, VerificationData } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials, rememberMe = false) => {
      const result = await dispatch(loginAsync({ credentials, rememberMe }));
      if (loginAsync.fulfilled.match(result)) {
        return result.payload.user;
      }
      throw new Error(result.payload as string || 'Login failed');
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerAsync(data));
      if (registerAsync.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload as string || 'Registration failed');
    },
    [dispatch]
  );

  const verifyEmail = useCallback(
    async (data: VerificationData) => {
      const result = await dispatch(verifyEmailAsync(data));
      if (verifyEmailAsync.fulfilled.match(result)) {
        return;
      }
      throw new Error(result.payload as string || 'Verification failed');
    },
    [dispatch]
  );

  const resendCode = useCallback(
    async (email: string) => {
      const result = await dispatch(resendCodeAsync(email));
      if (resendCodeAsync.fulfilled.match(result)) {
        return;
      }
      throw new Error(result.payload as string || 'Failed to resend code');
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutAsync());
    if (logoutAsync.fulfilled.match(result)) {
      return;
    }
    throw new Error(result.payload as string || 'Logout failed');
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    resendCode,
    logout,
    clearError: clearAuthError,
  };
}
