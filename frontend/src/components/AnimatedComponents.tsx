/**
 * Animated Container Component
 * Wrapper for Framer Motion animations
 * Use this for page/section animations
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeIn, slideUp, scaleIn, staggerContainer } from '@/lib/animations';

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'stagger';
  delay?: number;
  children: React.ReactNode;
}

export function AnimatedContainer({ 
  animation = 'fadeIn', 
  delay = 0,
  children,
  className,
  ...props 
}: AnimatedContainerProps) {
  const animations = {
    fadeIn,
    slideUp,
    scaleIn,
    stagger: staggerContainer,
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={selectedAnimation}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Card Component
 * Card with hover effects
 */
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function AnimatedCard({ 
  children, 
  hoverable = true,
  className,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={hoverable ? "tap" : undefined}
      variants={hoverable ? {
        rest: { scale: 1 },
        hover: { scale: 1.02, y: -4 },
        tap: { scale: 0.98 }
      } : undefined}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Button Component
 * Button with tap effect
 */
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
}

export function AnimatedButton({ 
  children, 
  className,
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * Emergency Alert Animation
 * Urgent attention-grabbing animation
 */
interface EmergencyAlertProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  pulse?: boolean;
}

export function EmergencyAlert({ 
  children, 
  pulse = false,
  className,
  ...props 
}: EmergencyAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: pulse ? [1, 1.05, 1] : 1,
        y: 0
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
        scale: pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        } : undefined
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
