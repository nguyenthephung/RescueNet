# ✨ RescueNet - Professional Next.js Base Project

A professional, scalable Next.js 15 base project with TypeScript, TailwindCSS, dark/light mode, internationalization (EN/VI), and modular role-based architecture.

## 🎯 Overview

This is a fully-configured base project designed for rapid development with consistent styling, theme support, and modular structure. Perfect for solo developers or teams building scalable applications.

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Development server
npm run dev          # → http://localhost:3000

# Production build
npm run build
npm start

# Lint code
npm run lint
```

## ✨ Features

- ⚡ **Next.js 15** - Latest React framework with App Router & Turbopack
- 🎨 **TailwindCSS v4** - Custom theme with design tokens
- 🌓 **Dark/Light Mode** - System-aware theme switching
- 🌍 **i18n** - English & Vietnamese support
- 📱 **Responsive** - Mobile-first design
- 🧩 **Component Library** - Reusable UI components (Button, Card, Input, etc.)
- 🔧 **Custom Hooks** - Theme, language, responsive utilities
- 📦 **Role Modules** - Admin, User, Staff examples
- 🎯 **TypeScript** - Full type safety
- 🎨 **Consistent Styling** - Centralized theme configuration

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app/              # Next.js App Router (routes & layouts)
│   ├── components/       # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── LanguageSelector.tsx
│   ├── features/         # Role-based feature modules
│   │   ├── admin/       # Admin features
│   │   ├── user/        # User features
│   │   └── staff/       # Staff features
│   ├── hooks/           # Custom React hooks
│   │   ├── useTheme.ts
│   │   ├── useLanguage.ts
│   │   └── useWindowSize.ts
│   ├── lib/             # Utilities & configuration
│   │   ├── theme.ts     # Theme design tokens
│   │   ├── i18n.ts      # Translations
│   │   ├── constants.ts # App constants
│   │   └── utils.ts     # Helper functions
│   ├── styles/          # Global CSS
│   │   └── globals.css
│   └── types/           # TypeScript definitions
└── public/              # Static assets
```

## 🎨 Components

### Button
```tsx
import { Button } from '@/components';

<Button variant="primary" size="lg">Click me</Button>
<Button variant="outline" isLoading>Loading...</Button>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Sizes:** `sm`, `md`, `lg`

### Card
```tsx
import { Card } from '@/components';

<Card 
  title="Card Title" 
  description="Description"
  footer={<Button>Action</Button>}
>
  Content here
</Card>
```

### Input
```tsx
import { Input } from '@/components';

<Input 
  label="Email" 
  type="email" 
  error="Invalid email"
  required
/>
```

## 🔧 Hooks

```tsx
// Theme management
import { useTheme } from '@/hooks';
const { theme, toggleTheme } = useTheme();

// Internationalization
import { useLanguage } from '@/hooks';
const { language, setLanguage, t } = useLanguage();

// Responsive utilities
import { useWindowSize } from '@/hooks';
const { isMobile, isTablet, isDesktop } = useWindowSize();
```

## 🌍 Adding Translations

```tsx
// src/lib/i18n.ts
export const translations = {
  en: {
    'myFeature.title': 'My Feature',
  },
  vi: {
    'myFeature.title': 'Tính năng của tôi',
  },
};

// Usage in component
const { t } = useLanguage();
<h1>{t('myFeature.title')}</h1>
```

## 📦 Adding New Module

1. **Create folder:** `src/features/manager/`
2. **Create component:**
```tsx
'use client';

import { Card, Button } from '@/components';
import { useLanguage } from '@/hooks';

export function ManagerDashboard() {
  const { t } = useLanguage();
  
  return (
    <div className="container section">
      <Card title={t('manager.title')}>
        <p>Content here</p>
      </Card>
    </div>
  );
}
```
3. **Export:** Create `index.ts` with `export { ManagerDashboard } from './ManagerDashboard';`

## 🎨 Styling Guide

### Theme Colors
```tsx
<div className="bg-primary-600 text-white" />
<div className="bg-success-600" />
<div className="bg-error-600" />
```

### Dark Mode
```tsx
<div className="bg-white dark:bg-neutral-900">
  <p className="text-neutral-900 dark:text-neutral-50">
    Content
  </p>
</div>
```

### Responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

## 📚 Documentation

- **GETTING_STARTED.md** - Complete setup guide
- **PROJECT_STRUCTURE.md** - Detailed architecture
- **ADDING_MODULES.md** - Module creation guide
- **STYLING_GUIDE.md** - Complete styling reference

## 🎯 Best Practices

### ✅ DO:
- Use shared components from `@/components`
- Use theme colors: `bg-primary-600` (not `bg-[#0ea5e9]`)
- Use theme spacing: `p-4` (not `p-[16px]`)
- Add dark mode: `dark:bg-neutral-900`
- Test responsive design
- Add TypeScript types

### ❌ DON'T:
- Hardcode colors or spacing values
- Create duplicate components
- Forget 'use client' directive for hooks
- Skip dark mode variants
- Use inline styles instead of Tailwind

## 🔍 Key Files

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Tailwind configuration |
| `src/lib/theme.ts` | Theme design tokens |
| `src/lib/i18n.ts` | Translations (EN/VI) |
| `src/lib/constants.ts` | App constants |
| `src/styles/globals.css` | Global styles & utilities |
| `src/types/index.ts` | TypeScript types |

## 🚀 What's Next?

1. ✅ **Run dev server:** `npm run dev`
2. ✅ **Explore examples:** Check `src/features/` for role modules
3. ✅ **Test features:** Try dark mode toggle & language switch
4. 📝 **Read docs:** Check GETTING_STARTED.md
5. 🎨 **Customize theme:** Edit `src/lib/theme.ts`
6. 📦 **Add modules:** Create new features in `src/features/`
7. 🌍 **Add translations:** Update `src/lib/i18n.ts`
8. 🚀 **Deploy:** Ready for Vercel, Netlify, or any host

## 🌐 Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

Deploy to:
- **Vercel** (recommended) - Zero configuration
- **Netlify** - Easy setup
- **Any Node.js host**

## 📞 Help & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **TailwindCSS Docs:** https://tailwindcss.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

## 🎉 You're Ready!

Your professional base project is fully configured and running!

**Development server:** http://localhost:3000

Start building your application with consistent styling, theme support, and modular architecture! 🚀

---

Built with ❤️ using Next.js 15, TypeScript, and TailwindCSS
