/**
 * Language Redux Slice
 * Manages language/i18n state with Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { translate, type translations } from '@/lib/i18n';

export type Language = 'en' | 'vi';

interface LanguageState {
  language: Language;
  isClient: boolean;
}

const initialState: LanguageState = {
  language: 'en',
  isClient: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (state.isClient && typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    setClientReady: (state) => {
      state.isClient = true;
    },
    loadLanguageFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('language') as Language | null;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
          state.language = savedLanguage;
        }
        state.isClient = true;
      }
    },
  },
});

export const { setLanguage, setClientReady, loadLanguageFromStorage } = languageSlice.actions;

// Selectors
export const selectLanguage = (state: { language: LanguageState }) => state.language.language;
export const selectIsClient = (state: { language: LanguageState }) => state.language.isClient;

// Helper function for translations (can be used outside components)
export const getTranslation = (key: keyof typeof translations['en'], language: Language, params?: Record<string, string | number>): string => {
  return translate(key, language, params);
};

export default languageSlice.reducer;
