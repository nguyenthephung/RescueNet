/**
 * Email Verification Page
 * 6-digit code verification with timer
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedContainer, Card, Button, Alert, AlertDescription } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { verifyEmail, resendCode, isLoading } = useAuth();

  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every((digit) => digit !== '') && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError(t('auth.enterCode'));
      return;
    }

    setError('');
    
    try {
      await verifyEmail({ email, code: codeToVerify });
      setSuccess(t('auth.accountCreated'));
      
      // Redirect to dashboard after 1.5s
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('auth.invalidCode'));
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setError('');
    setSuccess('');
    
    try {
      await resendCode(email);
      setSuccess(t('auth.codeSent'));
      setTimer(300); // Reset timer
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with 3D Phone Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-8"
        >
          {/* 3D Phone Verification Image */}
          <div className="relative w-40 h-40 mx-auto mb-6 perspective-1000">
            <motion.div
              animate={{
                rotateY: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-full h-full rounded-3xl bg-linear-to-br from-secondary-500 to-secondary-700 overflow-hidden shadow-2xl transform-gpu"
            >
              <img 
                src="/images/auth/phone-verify.png"
                alt="Phone Verification"
                className="w-full h-full object-cover"
              />
              
              {/* Animated rings */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-4 border-secondary-400 rounded-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.2, 0, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-4 border-secondary-300 rounded-3xl"
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-3 bg-linear-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent"
          >
            {t('auth.verifyEmail')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-2"
          >
            {t('auth.codeSent')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-semibold text-foreground bg-muted px-4 py-2 rounded-lg inline-block"
          >
            {email}
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 backdrop-blur-xl bg-background/80 border-2 shadow-2xl">
            <div className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert variant="critical">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert variant="success">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Code Inputs */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4 text-center">
                  {t('auth.enterCode')}
                </label>
                <div className="flex justify-center gap-3">
                  {code.map((digit, index) => (
                    <motion.input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLoading}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className={`
                        w-14 h-16 text-center text-3xl font-bold rounded-xl
                        border-2 transition-all duration-300
                        ${digit 
                          ? 'border-secondary-600 bg-secondary-50 dark:bg-secondary-900 shadow-lg scale-105' 
                          : 'border-border bg-background hover:border-secondary-400'
                        }
                        focus:outline-none focus:ring-4 focus:ring-secondary-600/20 focus:border-secondary-600
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      whileFocus={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>

              {/* Timer with Progress */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('auth.codeExpires')}</span>
                  <span className={`font-bold ${timer < 60 ? 'text-primary-600' : 'text-secondary-600'}`}>
                    {formatTime(timer)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timer / 300) * 100}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      timer < 60 ? 'bg-primary-600' : 'bg-secondary-600'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={() => handleVerify()}
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading || code.some((d) => !d)}
                >
                  {t('auth.verify')} →
                </Button>
              </motion.div>

              {/* Resend Code */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center pt-2"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className={`
                    text-sm font-semibold transition-all inline-flex items-center gap-2
                    ${canResend 
                      ? 'text-secondary-600 hover:text-secondary-700 hover:underline' 
                      : 'text-muted-foreground cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('auth.resendCode')}
                </button>
              </motion.div>
            </div>
          </Card>

          {/* Back to register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => router.push('/auth/register')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('common.cancel')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
