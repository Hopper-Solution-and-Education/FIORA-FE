'use client';

import { useEffect, useState } from 'react';

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof breakpoints;

export function useMatchBreakpoint() {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    isExtraLargeDesktop: false,
    activeBreakpoint: '' as 'xs' | Breakpoint,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueries = {
      sm: window.matchMedia(`(min-width: ${breakpoints.sm}px)`),
      md: window.matchMedia(`(min-width: ${breakpoints.md}px)`),
      lg: window.matchMedia(`(min-width: ${breakpoints.lg}px)`),
      xl: window.matchMedia(`(min-width: ${breakpoints.xl}px)`),
      '2xl': window.matchMedia(`(min-width: ${breakpoints['2xl']}px)`),
    };

    const updateState = () => {
      const sm = mediaQueries.sm.matches;
      const md = mediaQueries.md.matches;
      const lg = mediaQueries.lg.matches;
      const xl = mediaQueries.xl.matches;
      const xxl = mediaQueries['2xl'].matches;

      let activeBreakpoint: 'xs' | Breakpoint = 'xs';
      if (xxl) activeBreakpoint = '2xl';
      else if (xl) activeBreakpoint = 'xl';
      else if (lg) activeBreakpoint = 'lg';
      else if (md) activeBreakpoint = 'md';
      else if (sm) activeBreakpoint = 'sm';

      setState({
        isMobile: !sm,
        isTablet: sm && !lg,
        isDesktop: lg,
        isLargeDesktop: xl,
        isExtraLargeDesktop: xxl,
        activeBreakpoint,
      });
    };

    updateState();

    Object.values(mediaQueries).forEach((mql) => {
      mql.addEventListener('change', updateState);
    });

    return () => {
      Object.values(mediaQueries).forEach((mql) => {
        mql.removeEventListener('change', updateState);
      });
    };
  }, []);

  return state;
}

export default useMatchBreakpoint;
