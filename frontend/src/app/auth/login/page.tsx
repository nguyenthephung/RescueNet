/**
 * Login Page
 * User authentication with glassmorphism design
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedContainer, Card, Input, Button, Alert, AlertDescription, Separator } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t('validation.required'));
      return;
    }

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
      }, formData.rememberMe);

      // Role-based redirect
      const redirects = {
        admin: '/admin',
        staff: '/staff',
        volunteer: '/volunteer',
        citizen: '/dashboard',
      };

      router.push(redirects[user.role] || '/dashboard');
    } catch (err: any) {
      setError(err.message || t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="space-y-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 overflow-hidden shadow-xl">
                <img 
                  src="/images/logo/rescuenet-icon.png"
                  alt="RescueNet Logo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground">RescueNet</h2>
                <p className="text-sm text-muted-foreground">Emergency Response Platform</p>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-5xl lg:text-6xl font-black mb-4">
                <span className="bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Sign in to access your emergency response dashboard and coordinate with your team.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { value: '24/7', label: 'Support' },
                { value: '99.9%', label: 'Uptime' },
                { value: '<2min', label: 'Response' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-primary-600">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 overflow-hidden shadow-xl">
              <img 
                src="/images/logo/rescuenet-icon.png"
                alt="RescueNet Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-2">
              Welcome to <span className="text-primary-600">RescueNet</span>
            </h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          {/* Glassmorphism Card */}
          <Card className="p-8 backdrop-blur-xl bg-background/80 border-2 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Input
                  label={t('auth.email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <Input
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pt-2"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-border text-primary-600 focus:ring-2 focus:ring-primary-600 transition-all"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary-600 transition-colors">
                    {t('auth.rememberMe')}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => router.push('/auth/forgot-password')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all"
                  disabled={isLoading}
                >
                  {t('auth.forgotPassword')}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {t('auth.signIn')} →
                </Button>
              </motion.div>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50"
            >
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Demo Account</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono bg-background px-1.5 py-0.5 rounded">admin@rescue.net</span> / <span className="font-mono bg-background px-1.5 py-0.5 rounded">any password</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <button
                  onClick={() => router.push('/auth/register')}
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
                >
                  {t('auth.signUp')} →
                </button>
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
