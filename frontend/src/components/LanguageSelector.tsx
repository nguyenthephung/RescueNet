'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useIsMounted } from '@/hooks/useIsMounted';

/**
 * Language Selector Component
 * Switches between English and Vietnamese
 */
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const isMounted = useIsMounted();

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <button className="p-2 rounded-lg hover:bg-muted transition-colors">
        <div className="w-5 h-5" />
      </button>
    );
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
      aria-label="Toggle language"
      title="Toggle language"
    >
      {language === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}
    </button>
  );
}
