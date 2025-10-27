/**
 * Emergency SOS Page
 * Main emergency dashboard with SOS button, verification, and status
 * Follows CODING_RULES.md - Theme colors, i18n, animations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { useLanguageRedux } from '@/hooks/useLanguageRedux';
import { useAuth } from '@/hooks/useAuthRedux';
import { AnimatedContainer, Card, Button, Input, Alert, AlertTitle, AlertDescription, Badge, LanguageSelector, Separator } from '@/components';
import { SOSButton, EmergencyStatusComponent } from '@/features/emergency';
import type { IncidentType, EmergencyLocation } from '@/types';

export default function EmergencyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useLanguageRedux();
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

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          setLocationError(t('location.error'));
          console.error('Location error:', error);
        }
      );
    } else {
      setLocationError(t('location.denied'));
    }
  }, [t]);

  // Check rate limit on mount
  useEffect(() => {
    dispatch(checkRateLimitAsync({ userId: user?.id }));
  }, [dispatch, user]);

  // Send SOS
  const handleSendSOS = useCallback(async () => {
    if (!location) {
      alert(t('location.allow'));
      return;
    }

    if (rateLimitInfo?.isBlocked) {
      alert(t('rateLimit.exceeded'));
      return;
    }

    try {
      await dispatch(sendSOSAsync({
        incidentType,
        location,
        description: description || undefined,
        userId: user?.id,
        phoneNumber: phoneNumber || undefined
      })).unwrap();
    } catch (error: any) {
      console.error('Failed to send SOS:', error);
    }
  }, [dispatch, location, incidentType, description, user, phoneNumber, rateLimitInfo, t]);

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

  // Mark as okay
  const handleMarkOkay = async () => {
    if (currentRequest?.id) {
      await dispatch(markAsOkayAsync(currentRequest.id));
      dispatch(resetEmergency());
    }
  };

  // Cancel SOS
  const handleCancel = async () => {
    if (currentRequest?.id) {
      await dispatch(cancelSOSAsync(currentRequest.id));
      dispatch(resetEmergency());
    }
  };

  const incidentTypes: IncidentType[] = ['medical', 'fire', 'flood', 'security', 'accident', 'other'];

  return (
    <div className="min-h-screen from-neutral-50 to-neutral-100">
      <AnimatedContainer animation="fadeIn" className="container section">
        {/* Top Right Controls */}
        <div className="absolute top-8 right-8">
          <LanguageSelector />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 uppercase tracking-wide">
            {t('sos.title')}
          </h1>
          
          {/* Verification Level Badge */}
          <Badge 
            variant={verificationLevel === 2 ? 'success' : verificationLevel === 1 ? 'warning' : 'default'}
            className="text-sm"
          >
            {t(`verify.level${verificationLevel}`)}
          </Badge>

          {/* Rate Limit Info */}
          {rateLimitInfo && !rateLimitInfo.isBlocked && (
            <p className="text-sm text-neutral-600 mt-2">
              {t('rateLimit.remaining', { count: rateLimitInfo.remainingRequests })}
            </p>
          )}
        </div>

        {/* Error Alert */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: SOS Button & Options */}
          <div className="space-y-6">
            {!currentRequest ? (
              <>
                {/* SOS Button */}
                <div className="flex justify-center">
                  <SOSButton 
                    onSend={handleSendSOS} 
                    disabled={rateLimitInfo?.isBlocked || !location}
                  />
                </div>

                {/* Incident Type Selection */}
                <Card title={t('incident.selectType')}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {incidentTypes.map(type => (
                      <Button
                        key={type}
                        variant={incidentType === type ? 'primary' : 'outline'}
                        onClick={() => setIncidentType(type)}
                        className="h-20 font-semibold"
                      >
                        <div className="text-center uppercase text-sm tracking-wide">
                          {t(`incident.${type}`)}
                        </div>
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Optional Description */}
                <Card>
                  <Input
                    label={t('incident.description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('incident.description')}
                  />
                </Card>
              </>
            ) : (
              /* Emergency Status */
              <EmergencyStatusComponent
                request={currentRequest}
                onMarkOkay={handleMarkOkay}
                onCancel={handleCancel}
              />
            )}
          </div>

          {/* Right: Verification */}
          <div className="space-y-6">
            {verificationLevel === 0 && !requiresOtp && (
              <Card title={t('verify.upgradePrompt')} className="bg-warning-50 border-warning-600">
                <div className="space-y-4">
                  <p className="text-sm text-neutral-700">
                    {t('verify.upgradePrompt')}
                  </p>
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
                    className="w-full"
                  >
                    {t('verify.sendOtp')}
                  </Button>
                </div>
              </Card>
            )}

            {requiresOtp && (
              <Card title={t('verify.enterOtp')} className="bg-secondary-50 border-secondary-600">
                <div className="space-y-4">
                  <Input
                    label={t('verify.enterOtp')}
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
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
            )}

            {/* Info Cards */}
            <Card className="bg-secondary-600 text-white">
              <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{t('common.emergency')}</h3>
              <Separator className="mb-4 bg-white/20" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Priority Level</span>
                  <Badge 
                    variant={verificationLevel === 2 ? 'success' : verificationLevel === 1 ? 'warning' : 'default'}
                    className="text-xs"
                  >
                    {verificationLevel === 2 ? 'HIGH' : verificationLevel === 1 ? 'NORMAL' : 'LOW'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Estimated Time</span>
                  <span className="text-lg font-bold">{verificationLevel === 2 ? '5' : verificationLevel === 1 ? '10' : '15'} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Location Status</span>
                  <span className="text-sm font-semibold">{location ? 'Detected' : 'Loading...'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
