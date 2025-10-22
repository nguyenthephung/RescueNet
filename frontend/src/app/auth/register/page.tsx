/**
 * Register Role Selection Page
 * User selects their role before registration
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedContainer, Card } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import type { UserRole } from '@/types';

interface RoleOption {
  role: UserRole;
  imagePath: string;
  titleKey: string;
  descKey: string;
  color: string;
  gradient: string;
}

const roleOptions: RoleOption[] = [
  {
    role: 'citizen',
    imagePath: '/images/roles/citizen.jpg',
    titleKey: 'auth.citizen',
    descKey: 'auth.citizenDesc',
    color: 'bg-secondary-600',
    gradient: 'from-secondary-500 to-secondary-700',
  },
  {
    role: 'volunteer',
    imagePath: '/images/roles/volunteer.png',
    titleKey: 'auth.volunteer',
    descKey: 'auth.volunteerDesc',
    color: 'bg-success-600',
    gradient: 'from-success-500 to-success-700',
  },
  {
    role: 'staff',
    imagePath: '/images/roles/staff.png',
    titleKey: 'auth.staff',
    descKey: 'auth.staffDesc',
    color: 'bg-primary-600',
    gradient: 'from-primary-500 to-primary-700',
  },
];

export default function RegisterSelectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    // Navigate to registration form with selected role
    setTimeout(() => {
      router.push(`/auth/register/form?role=${role}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatedContainer animation="fadeIn" className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {t('auth.welcomeTo')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('auth.registerAs')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleOptions.map((option, index) => (
            <motion.div
              key={option.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectRole(option.role)}
              className="cursor-pointer"
            >
              <Card className={`
                relative overflow-hidden transition-all duration-300 h-full flex flex-col
                ${selectedRole === option.role ? 'ring-4 ring-primary-500' : ''}
                hover:shadow-xl group
              `}>
                {/* Image Section */}
                <div className={`relative h-48 bg-linear-to-br ${option.gradient} overflow-hidden shrink-0`}>
                  <img 
                    src={option.imagePath}
                    alt={t(option.titleKey as any)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content Section - Fixed height */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {t(option.titleKey as any)}
                  </h3>

                  {/* Description - Fixed 3 lines */}
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1 min-h-[60px]">
                    {t(option.descKey as any)}
                  </p>

                  {/* Action Hint */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                    <span>Select Role</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedRole === option.role && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Back to login */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('auth.alreadyHaveAccount')} <span className="text-primary-600 font-semibold">{t('auth.signIn')}</span>
          </button>
        </div>
      </AnimatedContainer>
    </div>
  );
}
