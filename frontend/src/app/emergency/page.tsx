/**
 * Emergency SOS Page - Redesigned with Modern UX/UI
 * Inspired by Uber Safety, Grab SafetyCenter, emergency response apps
 * Features: Header, Footer, Tooltips, Progressive Disclosure, Micro-interactions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, type RootState } from '@/store';
import { 
  checkRateLimitAsync, 
  sendSOSAsync, 
  cancelSOSAsync,
  markAsOkayAsync,
  sendOTPAsync,
  verifyPhoneAsync,
  setRequiresOtp,
  resetEmergency
} from '@/store/slices/emergencySlice';
import { useLanguage } from '@/hooks';
import { useAuth } from '@/hooks/useAuthRedux';
import { useLocationWebSocket } from '@/hooks/useLocationWebSocket';
import { 
  AnimatedContainer, 
  Card, 
  Button, 
  Input, 
  Alert, 
  AlertTitle, 
  AlertDescription, 
  Badge, 
  Separator,
  Header,
  Footer,
  InfoTooltip
} from '@/components';
import { SOSButton, EmergencyStatusComponent } from '@/features/emergency';
import type { IncidentType, EmergencyLocation } from '@/types';

// Dynamic import EmergencyMap to avoid SSR hydration errors
const EmergencyMap = dynamic(
  () => import('@/components').then((mod) => ({ default: mod.EmergencyMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center bg-neutral-100 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-neutral-600">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }
);

export default function EmergencyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  const { 
    currentRequest, 
    verificationLevel, 
    rateLimitInfo, 
    error, 
    requiresOtp,
    requiresCaptcha,
    isLoading 
  } = useAppSelector((state: RootState) => state.emergency);

  const [location, setLocation] = useState<EmergencyLocation | null>(null);
  const [incidentType, setIncidentType] = useState<IncidentType>('medical');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [locationError, setLocationError] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // WebSocket connection for real-time location tracking
  const { isConnected: wsConnected, error: wsError } = useLocationWebSocket({
    requestId: currentRequest?.id,
    location,
    isActive: !!currentRequest, // Only track when there's an active emergency
  });

  // Get user location and update continuously
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard
    
    if ('geolocation' in navigator) {
      // Get initial location with high accuracy
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          console.log('Location acquired:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          setLocationError(t('location.error'));
          console.error('Location error:', error.message || 'Unknown error', error.code);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      // Watch location changes when emergency is active
      let watchId: number | null = null;
      if (currentRequest) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            console.error('Location watch error:', error.message || 'Unknown error');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }

      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } else {
      setLocationError(t('location.denied'));
    }
  }, [t, currentRequest]);

  // Check rate limit on mount
  // TODO: Re-enable after testing
  /*
  useEffect(() => {
    dispatch(checkRateLimitAsync({ userId: user?.id }));
  }, [dispatch, user]);
  */

  // Send SOS
  const handleSendSOS = useCallback(async () => {
    console.log('🚨 handleSendSOS called!', { location, rateLimitInfo });
    
    if (!location) {
      alert(t('location.allow'));
      return;
    }

    // TODO: Re-enable rate limit check after testing
    /*
    if (rateLimitInfo?.isBlocked) {
      alert(t('rateLimit.exceeded'));
      return;
    }
    */

    console.log('📡 Sending SOS with data:', {
      incidentType,
      location,
      description,
      mediaFiles: mediaFiles.length,
      userId: user?.id,
      phoneNumber
    });

    try {
      // TODO: Upload media files to server and get URLs
      // For now, use preview URLs as placeholder
      const mediaUrls = previewUrls.length > 0 ? previewUrls : undefined;

      const result = await dispatch(sendSOSAsync({
        incidentType,
        location,
        description: description || undefined,
        mediaUrls,
        userId: user?.id,
        phoneNumber: phoneNumber || undefined
      })).unwrap();
      
      console.log('✅ SOS sent successfully:', result);
    } catch (error: any) {
      console.error('❌ Failed to send SOS:', error);
      alert('Lỗi: ' + (error.message || 'Không thể gửi SOS'));
    }
  }, [dispatch, location, incidentType, description, mediaFiles, previewUrls, user, phoneNumber, rateLimitInfo, t]);

  // Send OTP
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert(t('validation.required'));
      return;
    }

    try {
      await dispatch(sendOTPAsync(phoneNumber)).unwrap();
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert(t('auth.invalidCode'));
      return;
    }

    try {
      await dispatch(verifyPhoneAsync({ phoneNumber, code: otpCode })).unwrap();
      setOtpCode('');
    } catch (error: any) {
      console.error('Failed to verify OTP:', error);
    }
  };

  // Mark as okay - Apply penalty like cancel
  const handleMarkOkay = async () => {
    if (currentRequest?.id) {
      const confirmed = window.confirm(
        t('sos.okayConfirm') || 
        'Xác nhận bạn đã ổn? Hành động này sẽ trừ 1 lần sử dụng SOS của bạn.'
      );
      
      if (!confirmed) return;
      
      console.log('✅ Marking as okay:', currentRequest.id);
      
      try {
        // Call API to mark as okay (also applies penalty like cancel)
        await dispatch(markAsOkayAsync(currentRequest.id)).unwrap();
        dispatch(resetEmergency());
        
        // Re-check rate limit to reflect the penalty
        dispatch(checkRateLimitAsync({ userId: user?.id }));
        
        alert(t('sos.okayCompleted') || 'Tuyệt vời! Đã đánh dấu khẩn cấp hoàn tất. Đã trừ 1 lần sử dụng SOS.');
      } catch (error: any) {
        console.error('❌ Failed to mark as okay:', error);
        alert('Lỗi: ' + (error.message || 'Unknown error'));
      }
    }
  };

  // Cancel SOS with confirmation
  const handleCancel = async () => {
    if (currentRequest?.id) {
      const confirmed = window.confirm(
        t('sos.cancelConfirm') || 
        'Bạn có chắc muốn hủy yêu cầu khẩn cấp? Điều này sẽ trừ 1 lần sử dụng SOS của bạn.'
      );
      
      if (!confirmed) return;
      
      console.log('🚫 Cancelling SOS:', currentRequest.id);
      
      try {
        await dispatch(cancelSOSAsync(currentRequest.id)).unwrap();
        dispatch(resetEmergency());
        
        // Re-check rate limit to reflect the penalty
        dispatch(checkRateLimitAsync({ userId: user?.id }));
        
        alert(t('sos.cancelled') || 'Yêu cầu khẩn cấp đã bị hủy. Đã trừ 1 lần sử dụng.');
      } catch (error: any) {
        console.error('❌ Failed to cancel SOS:', error);
        alert('Lỗi khi hủy yêu cầu: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const incidentTypes: IncidentType[] = ['medical', 'fire', 'flood', 'security', 'accident', 'other'];

  // Get incident icon
  const getIncidentIcon = (type: IncidentType) => {
    const icons = {
      medical: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      fire: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      flood: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      security: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      accident: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      other: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Modern Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className=" from-primary-50 to-white border-b border-primary-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
         
              
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-4">
                {t('sos.title')}
              </h1>
              
              <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
                {currentRequest 
                  ? t('sos.processingRequest')
                  : t('sos.pressButton')
                }
              </p>

              {/* Verification Level - Prominent Display */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border-2 border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    verificationLevel === 2 ? 'bg-success-500' : 
                    verificationLevel === 1 ? 'bg-warning-500' : 
                    'bg-neutral-400'
                  }`} />
                  <span className="text-sm font-semibold text-neutral-900">{t('status.label')}:</span>
                </div>
                <Badge 
                  variant={verificationLevel === 2 ? 'success' : verificationLevel === 1 ? 'warning' : 'default'}
                  className="text-sm font-bold"
                >
                  {t(`verify.level${verificationLevel}`)}
                </Badge>
                <InfoTooltip
                  content={
                    <div className="space-y-2">
                      <p className="font-semibold">{t('verify.tooltipTitle')}</p>
                      <p><strong>{t('verify.level0Short')}:</strong> {t('verify.level0Details')}</p>
                      <p><strong>{t('verify.level1Short')}:</strong> {t('verify.level1Details')}</p>
                      <p><strong>{t('verify.level2Short')}:</strong> {t('verify.level2Details')}</p>
                    </div>
                  }
                  position="bottom"
                />
              </div>

              {/* Rate Limit Info */}
              {rateLimitInfo && !rateLimitInfo.isBlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-neutral-600"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200">
                    <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('rateLimit.remaining', { count: rateLimitInfo.remainingRequests })}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Main Emergency Interface */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Error Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <Alert variant="critical">
                  <AlertTitle>{t('common.error')}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <Alert variant="warning">
                  <AlertTitle>{t('location.error')}</AlertTitle>
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: SOS Button & Incident Type */}
            <div className="lg:col-span-2 space-y-6">
              {!currentRequest ? (
                <>
                  {/* SOS Button Section */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-xl border-2 border-neutral-200 p-8"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-wide">
                          {t('sos.activationTitle')}
                        </h2>
                        <InfoTooltip
                          content={t('sos.activationTooltip')}
                          position="right"
                        />
                      </div>
                      <p className="text-sm text-neutral-600">
                        {t('sos.holdButtonInstruction')}
                      </p>
                    </div>

                    <div className="flex justify-center mb-6">
                      <SOSButton 
                        onSend={handleSendSOS} 
                        disabled={!location}
                        // disabled={rateLimitInfo?.isBlocked || !location} // TODO: Re-enable after testing
                      />
                    </div>

                    {/* Debug: Show why button is disabled */}
                    {!location && (
                      <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm">
                        <p className="font-semibold text-warning-800 mb-1">⚠️ Nút SOS bị vô hiệu hóa:</p>
                        <ul className="list-disc list-inside text-warning-700 space-y-1">
                          <li>Đang xác định vị trí của bạn... Vui lòng cho phép truy cập GPS</li>
                          {/* {rateLimitInfo?.isBlocked && <li>Bạn đã vượt quá giới hạn yêu cầu SOS</li>} */}
                        </ul>
                      </div>
                    )}
                    
                    {/* Location status (show when available) */}
                    {location && (
                      <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                        <p className="text-xs text-success-700">
                          ✅ Vị trí: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} (±{Math.round(location.accuracy || 0)}m)
                        </p>
                      </div>
                    )}

                    {/* Location Status Indicator */}
                    <div className="flex flex-col items-center gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {location ? (
                          <>
                            <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-success-700">{t('location.detected')}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-warning-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-warning-700">{t('location.detecting')}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Show location error if any */}
                      {locationError && (
                        <div className="text-xs text-error-600 bg-error-50 px-3 py-1 rounded-full">
                          {locationError}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Real-time Location Map */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Card>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-neutral-900">{t('location.yourLocation')}</h3>
                          {wsConnected && currentRequest && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-semibold">
                              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                              Live
                            </span>
                          )}
                        </div>
                        <InfoTooltip
                          content="Vị trí của bạn đang được chia sẻ thời gian thực với đội cứu hộ khi có sự cố khẩn cấp."
                          position="left"
                        />
                      </div>
                      <EmergencyMap location={location} className="h-96" />
                      {wsError && (
                        <p className="text-sm text-warning-600 mt-2">{wsError}</p>
                      )}
                    </Card>
                  </motion.div>

                  {/* Incident Type Selection */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-neutral-900">{t('incident.selectType')}</h3>
                        <InfoTooltip
                          content={t('incident.selectTypeTooltip')}
                          position="right"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {incidentTypes.map(type => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIncidentType(type)}
                            className={`
                              relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                              ${incidentType === type 
                                ? 'shadow-lg' 
                                : 'bg-white border-neutral-200 hover:border-primary-300 hover:shadow-md'
                              }
                            `}
                            style={incidentType === type ? {
                              backgroundColor: 'rgb(220, 38, 38)',
                              borderColor: 'rgb(220, 38, 38)'
                            } : undefined}
                          >
                            <div 
                              className={incidentType === type ? '' : 'text-primary-600'}
                              style={incidentType === type ? { color: 'white' } : undefined}
                            >
                              {getIncidentIcon(type)}
                            </div>
                            <span 
                              className={`text-sm font-bold uppercase tracking-wide ${incidentType === type ? '' : 'text-neutral-700'}`}
                              style={incidentType === type ? { color: 'white' } : undefined}
                            >
                              {t(`incident.${type}`)}
                            </span>
                            {incidentType === type && (
                              <motion.div
                                layoutId="selected-incident"
                                className="absolute -top-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Optional Description */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-bold text-neutral-900">
                          {t('incident.description')}
                        </label>
                        <InfoTooltip
                          content="Provide additional details to help responders assess the situation better. This is optional but recommended."
                          position="right"
                        />
                      </div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('incident.descriptionPlaceholder')}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                        rows={3}
                      />
                      <p className="text-xs text-neutral-500 mt-2">
                        {t('incident.example1')}
                      </p>

                      {/* Media Upload */}
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm font-semibold text-neutral-900">
                            {t('sos.media') || 'Photos/Videos'} ({mediaFiles.length}/3)
                          </label>
                        </div>

                        {/* Preview Grid */}
                        {previewUrls.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {previewUrls.map((url, index) => (
                              <div key={index} className="relative aspect-square">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg border-2 border-neutral-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFiles = mediaFiles.filter((_, i) => i !== index);
                                    const newUrls = previewUrls.filter((_, i) => i !== index);
                                    URL.revokeObjectURL(previewUrls[index]);
                                    setMediaFiles(newFiles);
                                    setPreviewUrls(newUrls);
                                  }}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload Button */}
                        {mediaFiles.length < 3 && (
                          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer">
                            <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-neutral-700 font-medium">
                              {t('sos.uploadMedia') || 'Add Photo/Video'}
                            </span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length === 0) return;
                                const newFiles = [...mediaFiles, ...files].slice(0, 3);
                                setMediaFiles(newFiles);
                                const urls = newFiles.map(file => URL.createObjectURL(file));
                                setPreviewUrls(urls);
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </>
              ) : (
                /* Emergency Status - Active Request */
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <EmergencyStatusComponent
                    request={currentRequest}
                    onMarkOkay={handleMarkOkay}
                    onCancel={handleCancel}
                  />
                </motion.div>
              )}
            </div>

            {/* Right Column: Verification & Info */}
            <div className="space-y-6">
              {/* Verification Upgrade */}
              {verificationLevel === 0 && !requiresOtp && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-warning-50 border-warning-500 border-2">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-warning-500 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-warning-900 mb-1">
                          {t('verify.upgradePriorityTitle')}
                        </h3>
                        <p className="text-sm text-warning-800 mb-3">
                          {t('verify.upgradePrompt')}
                        </p>
                        
                        {/* Benefits List */}
                        <div className="bg-white/50 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-warning-900 mb-2">
                            {t('verify.benefits') || 'Xác minh SĐT để được:'}
                          </p>
                          <ul className="space-y-1 text-xs text-warning-800">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-success-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{t('verify.benefit1') || 'Ưu tiên cao hơn (ETA giảm từ 15 → 10 phút)'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-success-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{t('verify.benefit2') || 'Tăng giới hạn SOS (2 → 5 lần/ngày)'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-success-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{t('verify.benefit3') || 'Nhận thông báo SMS về trạng thái cứu hộ'}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        label={t('verify.phoneNumber')}
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+84 xxx xxx xxx"
                      />
                      <Button 
                        variant="primary" 
                        onClick={handleSendOTP}
                        disabled={isLoading || !phoneNumber}
                        className="w-full bg-warning-600 hover:bg-warning-700"
                      >
                        {t('verify.sendOtp')}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* OTP Verification */}
              {requiresOtp && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Card className="bg-secondary-50 border-secondary-500 border-2">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-secondary-900 mb-1">
                          {t('verify.enterCodeTitle')}
                        </h3>
                        <p className="text-sm text-secondary-800">
                          {t('verify.codeSentTo', { phone: phoneNumber } as any)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        label={t('verify.enterOtp')}
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="text-center text-2xl tracking-widest font-bold"
                      />
                      <Button 
                        variant="primary" 
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otpCode.length !== 6}
                        className="w-full"
                      >
                        {t('common.confirm')}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Priority Info Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div 
                  className="rounded-xl p-6 shadow-md"
                  style={{
                    background: 'linear-gradient(to bottom right, rgb(37 99 235), rgb(29 78 216))',
                    color: 'white'
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-black text-xl text-white uppercase tracking-wider">{t('status.yourStatus')}</h3>
                  </div>
                  <Separator className="mb-4 bg-white/20" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white opacity-90">{t('status.priorityLevel')}</span>
                      <Badge 
                        variant={verificationLevel === 2 ? 'success' : verificationLevel === 1 ? 'warning' : 'default'}
                        className="text-xs font-bold"
                      >
                        {verificationLevel === 2 ? t('priority.high') : verificationLevel === 1 ? t('priority.normal') : t('priority.low')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white opacity-90">{t('status.estimatedResponse')}</span>
                      <span className="text-2xl font-black text-white">{verificationLevel === 2 ? '5' : verificationLevel === 1 ? '10' : '15'} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white opacity-90">{t('status.dailyLimit')}</span>
                      <span className="text-lg font-bold text-white">{verificationLevel === 2 ? '20' : verificationLevel === 1 ? '5' : '2'} {t('status.requests')}</span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex items-center gap-2 text-xs text-white opacity-75">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{t('priority.createFullAccount')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Tips */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <h3 className="font-bold text-lg text-neutral-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    {t('tips.title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-success-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{t('tips.stayCalm')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-success-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{t('tips.allowLocation')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-success-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{t('tips.keepPhone')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-success-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{t('tips.call113')}</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <Footer />
    </div>
  );
}
