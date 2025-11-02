'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to check if component is mounted
 * Useful for preventing SSR hydration issues
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
