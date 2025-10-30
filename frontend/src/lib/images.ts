/**
 * Image paths constants
 * Centralized image path management
 */

// Role images
export const ROLE_IMAGES = {
  citizen: '/images/roles/citizen.png',
  volunteer: '/images/roles/volunteer.png',
  staff: '/images/roles/staff.png',
  admin: '/images/roles/admin.png',
} as const;

// Auth illustrations
export const AUTH_IMAGES = {
  phoneVerify: '/images/auth/phone-verify.png',
  emailVerify: '/images/auth/email-verify.png',
  forgotPassword: '/images/auth/forgot-password.png',
} as const;

// Logo and branding
export const LOGO_IMAGES = {
  icon: '/images/logo/rescuenet-icon.png',
  full: '/images/logo/rescuenet-full.png',
  white: '/images/logo/rescuenet-white.png',
} as const;

// Background images
export const BG_IMAGES = {
  hero: '/images/backgrounds/hero.jpg',
  emergency: '/images/backgrounds/emergency.jpg',
} as const;

// Helper function to get role image
export const getRoleImage = (role: 'citizen' | 'volunteer' | 'staff' | 'admin') => {
  return ROLE_IMAGES[role];
};

// Helper function to get auth image
export const getAuthImage = (type: keyof typeof AUTH_IMAGES) => {
  return AUTH_IMAGES[type];
};

// Helper function to get logo
export const getLogo = (variant: keyof typeof LOGO_IMAGES = 'icon') => {
  return LOGO_IMAGES[variant];
};

// Export all paths as array for preloading
export const ALL_IMAGE_PATHS = [
  ...Object.values(ROLE_IMAGES),
  ...Object.values(AUTH_IMAGES),
  ...Object.values(LOGO_IMAGES),
  ...Object.values(BG_IMAGES),
] as const;
