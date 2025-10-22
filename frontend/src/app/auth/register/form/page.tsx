/**
 * Register Form Page
 * User registration with role-specific fields
 * Split screen design with hero image
 */

'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedContainer, Card, Input, Button, Alert, AlertDescription } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterData, UserRole } from '@/types';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { register, isLoading } = useAuth();

  const [role, setRole] = useState<UserRole>('citizen');

  // Fix hydration: Sync role from URL after mount
  useEffect(() => {
    const urlRole = searchParams.get('role') as UserRole;
    if (urlRole) {
      setRole(urlRole);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role,
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError(t('validation.required'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('validation.passwordMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await register(formData);
      
      if (result.requiresVerification) {
        // Navigate to verification page
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const getRoleImage = (role: UserRole) => {
    const images = {
      citizen: '/images/roles/citizen.jpg',
      volunteer: '/images/roles/volunteer.png',
      staff: '/images/roles/staff.png',
      admin: '/images/roles/admin.png',
    };
    return images[role];
  };

  const getRoleGradient = (role: UserRole) => {
    const gradients = {
      citizen: 'from-secondary-500 to-secondary-700',
      volunteer: 'from-success-500 to-success-700',
      staff: 'from-primary-500 to-primary-700',
      admin: 'from-warning-500 to-warning-700',
    };
    return gradients[role];
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero Image Section - Exactly 50% width */}
      <div className={`relative hidden lg:flex flex-col items-center justify-center w-1/2 bg-linear-to-br ${getRoleGradient(role)} px-8 py-12 xl:px-16`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Role Image - Large and prominent */}
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={getRoleImage(role)}
                  alt={t(`auth.${role}` as any)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="space-y-3">
                <h2 className="text-4xl xl:text-5xl font-black leading-tight">
                  Join as {t(`auth.${role}` as any)}
                </h2>
                <p className="text-base xl:text-lg text-white/90 leading-relaxed">
                  {t(`auth.${role}Desc` as any)}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {['Quick Emergency Response', 'Real-time Updates', '24/7 Support'].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right: Form Section - Exactly 50% width */}
        <div className="flex items-center justify-center w-full lg:w-1/2 px-6 py-12 lg:px-12 bg-background">
          <div className="w-full max-w-lg">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl xl:text-4xl font-black mb-2 text-foreground">
                Create Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Fill in your details to get started as {t(`auth.${role}` as any)}
              </p>
            </motion.div>

            {/* Form */}
            <Card className="p-6 xl:p-8 shadow-xl border-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Alert variant="critical">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input
                    label={t('auth.fullName')}
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      label={t('auth.email')}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Input
                      label={t('auth.phone')}
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Input
                    label={t('auth.password')}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Input
                    label={t('auth.confirmPassword')}
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {t('auth.signUp')} →
                  </Button>
                </motion.div>
              </form>

              {/* Back to role selection */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push('/auth/register')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('common.cancel')}
                </button>
              </div>
            </Card>

            {/* Already have account */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {t('auth.signIn')}
                </button>
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}

export default function RegisterFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
