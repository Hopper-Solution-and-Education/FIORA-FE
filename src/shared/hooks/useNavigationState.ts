'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface NavigationState {
  isNavigating: boolean;
  previousPath: string | null;
  currentPath: string | null;
  navigationStartTime: number | null;
}

export const useNavigationState = () => {
  const pathname = usePathname();
  const [state, setState] = useState<NavigationState>({
    isNavigating: false,
    previousPath: null,
    currentPath: pathname,
    navigationStartTime: null,
  });
  const prevPathRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if navigation started
    if (prevPathRef.current && prevPathRef.current !== pathname) {
      const navigationStartTime = Date.now();

      setState((prev) => ({
        ...prev,
        isNavigating: true,
        previousPath: prevPathRef.current,
        currentPath: pathname,
        navigationStartTime,
      }));

      // Wait for navigation to complete
      timeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isNavigating: false,
        }));
      }, 100);
    } else if (prevPathRef.current === null) {
      // Initial load
      setState({
        isNavigating: false,
        previousPath: null,
        currentPath: pathname,
        navigationStartTime: null,
      });
    }

    prevPathRef.current = pathname;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  return state;
};
