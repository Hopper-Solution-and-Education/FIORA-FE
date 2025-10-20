'use client';

import { useEffect, useMemo, useState } from 'react';

export function useVariableLoadedListener<S>(selector: () => S, dependencies: any[] = []) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const interval = setInterval(() => {
      const instance = selector();
      if (instance) setIsLoaded(true);
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 120_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoaded, ...dependencies]);

  return useMemo(() => selector(), [isLoaded, ...dependencies]);
}
