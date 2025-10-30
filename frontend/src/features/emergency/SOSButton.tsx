/**
 * SOS Button Component
 * Professional emergency button with countdown - ShadCN style
 * Follows CODING_RULES.md - No childish icons
 */

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector, type RootState } from '@/store';
import { startCountdown, tickCountdown, cancelCountdown } from '@/store/slices/emergencySlice';
import { useLanguageRedux } from '@/hooks/useLanguageRedux';
import { Button, Alert, AlertTitle, AlertDescription } from '@/components';

interface SOSButtonProps {
  onSend: () => void;
  disabled?: boolean;
}

export function SOSButton({ onSend, disabled }: SOSButtonProps) {
  const dispatch = useAppDispatch();
  const { t } = useLanguageRedux();
  const { isCountingDown, countdown, isLoading } = useAppSelector((state: RootState) => state.emergency);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        dispatch(tickCountdown());
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      onSend();
    }
  }, [isCountingDown, countdown, dispatch, onSend]);

  const handlePress = () => {
    if (!isCountingDown && !isLoading && !disabled) {
      dispatch(startCountdown());
    }
  };

  const handleCancel = () => {
    dispatch(cancelCountdown());
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isCountingDown && !isLoading ? (
          <motion.div
            key="sos-button"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-error-600/20"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.button
                onClick={handlePress}
                disabled={disabled || isLoading}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative w-full py-20 rounded-2xl
                  shadow-2xl
                  transition-all duration-200
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                style={{
                  backgroundColor: 'rgb(220, 38, 38)',
                  boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.5)'
                }}
                onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(220, 38, 38)')}
              >
                <div className="flex flex-col items-center gap-4" style={{ color: 'white' }}>
                  <div className="text-4xl font-black tracking-wider uppercase">
                    {t('sos.button')}
                  </div>
                  <div className="text-sm font-medium opacity-90 tracking-wide">
                    {t('sos.tapToActivate')}
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Alert variant="critical" className="relative overflow-hidden">
              <AlertTitle className="text-center text-2xl font-bold mb-4">
                {t('sos.countdown', { seconds: countdown })}
              </AlertTitle>
              <AlertDescription className="text-center">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'backOut' }}
                  className="text-7xl font-black my-8"
                >
                  {countdown}
                </motion.div>
              </AlertDescription>
              <motion.div
                className="absolute bottom-0 left-0 h-2 bg-white/50"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isCountingDown || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className={`w-full py-6 text-lg font-semibold border-2 border-error-600 text-error-600 hover:bg-error-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t('sos.cancelButton')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
          <Alert variant="info" className="bg-secondary-50 border-secondary-500">
            <AlertTitle className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-3 border-secondary-600 border-t-transparent rounded-full"
              />
              <span className="font-bold text-secondary-900">{t('sos.sending')}</span>
            </AlertTitle>
            <AlertDescription className="text-sm text-secondary-700">
              📍 {t('sos.sendingLocation') || 'Vị trí của bạn đang được gửi đến đội cứu hộ. Vui lòng giữ kết nối mạng và GPS.'}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
