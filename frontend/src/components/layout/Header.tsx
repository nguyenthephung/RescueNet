/**
 * Header Component
 * Professional header with logo, navigation, emergency hotline
 * Sticky on scroll, glassmorphism design
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguageRedux } from '@/hooks';
import { useAuth } from '@/hooks';
import { LanguageSelector, Button } from '@/components';
import Image from 'next/image';

export function Header() {
  const router = useRouter();
  const { t } = useLanguageRedux();
  const { user, isAuthenticated } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const emergencyHotline = '113'; // Vietnam emergency number

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
         
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                RescueNet
              </h1>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                Emergency Response
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => router.push('/')}
              className="text-sm font-semibold text-neutral-700 hover:text-primary-600 transition-colors uppercase tracking-wide"
            >
              {t('common.home')}
            </button>
            <button
              onClick={() => router.push('/emergency')}
              className="text-sm font-semibold text-primary-600 uppercase tracking-wide"
            >
              {t('common.emergency')}
            </button>
            <button
              onClick={() => router.push('/about')}
              className="text-sm font-semibold text-neutral-700 hover:text-primary-600 transition-colors uppercase tracking-wide"
            >
              {t('common.about')}
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Emergency Hotline - Always Visible */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-primary-50 border-2 border-primary-600 rounded-xl">
              <div className="relative">
                <div className="absolute -inset-1 bg-primary-600 rounded-full animate-ping opacity-75" />
                <div className="relative w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-900 uppercase tracking-wider">
                  {t('common.callNow')}
                </p>
                <p className="text-2xl font-black text-primary-600 tracking-tight">
                  {emergencyHotline}
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* User Menu or Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-semibold text-neutral-900">
                    {user.fullName}
                  </span>
                  <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="text-sm font-semibold text-neutral-900">{user.fullName}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          {t('nav.profile')}
                        </button>
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          {t('nav.settings')}
                        </button>
                        <div className="h-px bg-neutral-200 my-2" />
                        <button
                          onClick={() => {
                            // Logout logic
                            router.push('/auth/login');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          {t('common.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push('/auth/login')}
                className="hidden md:block"
              >
                {t('common.login')}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-neutral-200 bg-white"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Emergency Hotline - Mobile */}
              <div className="flex items-center gap-3 p-4 bg-primary-50 border-2 border-primary-600 rounded-xl">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-900 uppercase tracking-wider">
                    {t('common.callNow')}
                  </p>
                  <p className="text-2xl font-black text-primary-600">{emergencyHotline}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    router.push('/');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors uppercase tracking-wide"
                >
                  {t('common.home')}
                </button>
                <button
                  onClick={() => {
                    router.push('/emergency');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg uppercase tracking-wide"
                >
                  {t('common.emergency')}
                </button>
                <button
                  onClick={() => {
                    router.push('/about');
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors uppercase tracking-wide"
                >
                  {t('common.about')}
                </button>
              </nav>

              <div className="pt-4 border-t border-neutral-200">
                <LanguageSelector />
              </div>

              {!isAuthenticated && (
                <Button
                  variant="primary"
                  onClick={() => {
                    router.push('/auth/login');
                    setShowMobileMenu(false);
                  }}
                  className="w-full"
                >
                  {t('common.login')}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

