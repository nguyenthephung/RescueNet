/**
 * Redux-based Language Hook
 * Replacement for useLanguage from LanguageContext
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage, selectLanguage, getTranslation } from '@/store/slices/languageSlice';
import { type translations } from '@/lib/i18n';

export type Language = 'en' | 'vi';

export function useLanguage() {
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);

  const changeLanguage = useCallback(
    (newLanguage: Language) => {
      dispatch(setLanguage(newLanguage));
    },
    [dispatch]
  );

  const t = useCallback(
    (key: keyof typeof translations['en'], params?: Record<string, string | number>): string => {
      return getTranslation(key, language, params);
    },
    [language]
  );

  return {
    language,
    setLanguage: changeLanguage,
    t,
  };
}
