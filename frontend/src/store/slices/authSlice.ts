/**
 * Auth Redux Slice
 * Manages authentication state with Redux Toolkit
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginCredentials, RegisterData, VerificationData } from '@/types';
import * as authApi from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Async Thunks - Handle API calls
 */

// Login thunk
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ credentials, rememberMe = false }: { credentials: LoginCredentials; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      if (!response.success || !response.user || !response.token) {
        throw new Error(response.message || 'Login failed');
      }

      // Save to localStorage if remember me
      if (rememberMe) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('auth_token', response.token);
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
      }

      return { user: response.user, token: response.token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register thunk
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      return { 
        success: true,
        requiresVerification: response.requiresVerification || false,
        message: response.message 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Verify email thunk
export const verifyEmailAsync = createAsyncThunk(
  'auth/verifyEmail',
  async (data: VerificationData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(data);
      
      if (!response.success) {
        throw new Error(response.message || 'Verification failed');
      }

      // After verification, user needs to login
      // Don't save to localStorage here
      return { 
        success: true,
        message: response.message 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Verification failed');
    }
  }
);

// Resend code thunk
export const resendCodeAsync = createAsyncThunk(
  'auth/resendCode',
  async (email: string, { rejectWithValue }) => {
    try {
      await authApi.resendCode(email);
      return email;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resend code');
    }
  }
);

// Logout thunk
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      
      // Clear storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');

      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Load saved auth state
export const loadAuthState = createAsyncThunk(
  'auth/loadState',
  async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        return { user, token };
      }

      return null;
    } catch (error) {
      return null;
    }
  }
);

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify Email
    builder
      .addCase(verifyEmailAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Don't set user/token here - user needs to login after verification
      })
      .addCase(verifyEmailAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Resend Code
    builder
      .addCase(resendCodeAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendCodeAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendCodeAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load Auth State
    builder
      .addCase(loadAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadAuthState.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearError, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
