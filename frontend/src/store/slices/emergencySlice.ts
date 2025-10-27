/**
 * Emergency Redux Slice
 * Manages SOS state, countdown, rate limiting, verification
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  EmergencyState, 
  EmergencyRequest, 
  IncidentType,
  EmergencyLocation,
  PhoneVerificationData,
  VerificationLevel
} from '@/types';
import * as emergencyApi from '@/lib/api/emergency';

const initialState: EmergencyState = {
  currentRequest: null,
  isCountingDown: false,
  countdown: 3, // seconds
  verificationLevel: 0, // Start with anonymous
  rateLimitInfo: null,
  isLoading: false,
  error: null,
  requiresCaptcha: false,
  requiresOtp: false,
  history: []
};

// Generate device ID if not exists
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(7) + '_' + Date.now();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

/**
 * Check rate limit
 */
export const checkRateLimitAsync = createAsyncThunk(
  'emergency/checkRateLimit',
  async ({ userId }: { userId?: string }, { rejectWithValue }) => {
    try {
      const deviceId = getDeviceId();
      const rateLimit = await emergencyApi.checkRateLimit(deviceId, userId);
      return rateLimit;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check rate limit');
    }
  }
);

/**
 * Send SOS
 */
export const sendSOSAsync = createAsyncThunk(
  'emergency/sendSOS',
  async ({ 
    incidentType, 
    location, 
    description, 
    mediaUrls, 
    userId, 
    phoneNumber 
  }: {
    incidentType: IncidentType;
    location: EmergencyLocation;
    description?: string;
    mediaUrls?: string[];
    userId?: string;
    phoneNumber?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { emergency: EmergencyState };
      const deviceId = getDeviceId();
      
      const request = await emergencyApi.sendSOS({
        incidentType,
        location,
        description,
        mediaUrls,
        verificationLevel: state.emergency.verificationLevel,
        deviceId,
        userId,
        phoneNumber
      });

      return request;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send SOS');
    }
  }
);

/**
 * Cancel SOS
 */
export const cancelSOSAsync = createAsyncThunk(
  'emergency/cancelSOS',
  async (sosId: string, { rejectWithValue }) => {
    try {
      await emergencyApi.cancelSOS(sosId);
      return sosId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel SOS');
    }
  }
);

/**
 * Get SOS status
 */
export const getSOSStatusAsync = createAsyncThunk(
  'emergency/getStatus',
  async (sosId: string, { rejectWithValue }) => {
    try {
      const status = await emergencyApi.getSOSStatus(sosId);
      return status;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get SOS status');
    }
  }
);

/**
 * Verify phone with OTP
 */
export const verifyPhoneAsync = createAsyncThunk(
  'emergency/verifyPhone',
  async (data: PhoneVerificationData, { rejectWithValue }) => {
    try {
      const result = await emergencyApi.verifyPhoneOTP(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify phone');
    }
  }
);

/**
 * Send OTP
 */
export const sendOTPAsync = createAsyncThunk(
  'emergency/sendOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      await emergencyApi.sendOTP(phoneNumber);
      return phoneNumber;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

/**
 * Mark as "I'm OK"
 */
export const markAsOkayAsync = createAsyncThunk(
  'emergency/markOkay',
  async (sosId: string, { rejectWithValue }) => {
    try {
      await emergencyApi.updateImOkay(sosId);
      return sosId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

/**
 * Emergency Slice
 */
const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    // Start countdown
    startCountdown: (state) => {
      state.isCountingDown = true;
      state.countdown = 3;
      state.error = null;
    },
    
    // Tick countdown
    tickCountdown: (state) => {
      if (state.countdown > 0) {
        state.countdown -= 1;
      }
      if (state.countdown === 0) {
        state.isCountingDown = false;
      }
    },
    
    // Cancel countdown
    cancelCountdown: (state) => {
      state.isCountingDown = false;
      state.countdown = 3;
    },
    
    // Set verification level
    setVerificationLevel: (state, action: PayloadAction<VerificationLevel>) => {
      state.verificationLevel = action.payload;
    },
    
    // Set requires CAPTCHA
    setRequiresCaptcha: (state, action: PayloadAction<boolean>) => {
      state.requiresCaptcha = action.payload;
    },
    
    // Set requires OTP
    setRequiresOtp: (state, action: PayloadAction<boolean>) => {
      state.requiresOtp = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset emergency state
    resetEmergency: (state) => {
      state.currentRequest = null;
      state.isCountingDown = false;
      state.countdown = 3;
      state.error = null;
      state.requiresCaptcha = false;
      state.requiresOtp = false;
    }
  },
  extraReducers: (builder) => {
    // Check rate limit
    builder
      .addCase(checkRateLimitAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkRateLimitAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rateLimitInfo = action.payload;
        
        // Check if suspicious pattern -> require CAPTCHA
        if (action.payload.requestCount >= 3 && action.payload.requestCount < 5) {
          state.requiresCaptcha = true;
        }
        
        if (action.payload.isBlocked) {
          state.error = 'Rate limit exceeded. Please try again later.';
        }
      })
      .addCase(checkRateLimitAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send SOS
    builder
      .addCase(sendSOSAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendSOSAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRequest = action.payload;
        state.history.unshift(action.payload);
        state.error = null;
      })
      .addCase(sendSOSAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel SOS
    builder
      .addCase(cancelSOSAsync.fulfilled, (state) => {
        if (state.currentRequest) {
          state.currentRequest.status = 'cancelled';
        }
      });

    // Get SOS status
    builder
      .addCase(getSOSStatusAsync.fulfilled, (state, action) => {
        if (state.currentRequest && state.currentRequest.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      });

    // Verify phone
    builder
      .addCase(verifyPhoneAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPhoneAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationLevel = action.payload.verificationLevel;
        state.requiresOtp = false;
        state.error = null;
      })
      .addCase(verifyPhoneAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send OTP
    builder
      .addCase(sendOTPAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOTPAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.requiresOtp = true;
        state.error = null;
      })
      .addCase(sendOTPAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Mark as okay
    builder
      .addCase(markAsOkayAsync.fulfilled, (state) => {
        if (state.currentRequest) {
          state.currentRequest.status = 'cancelled';
        }
      });
  }
});

export const {
  startCountdown,
  tickCountdown,
  cancelCountdown,
  setVerificationLevel,
  setRequiresCaptcha,
  setRequiresOtp,
  clearError,
  resetEmergency
} = emergencySlice.actions;

export default emergencySlice.reducer;
