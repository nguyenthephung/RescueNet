/**
 * Redux Store Provider
 * Wraps the app with Redux Provider
 */

'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { loadAuthState } from './slices/authSlice';
import { loadLanguageFromStorage } from './slices/languageSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load saved state on mount
    store.dispatch(loadAuthState());
    store.dispatch(loadLanguageFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
