'use client';
import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export const getChartMargins = (width: number) => {
  if (width < 640)
    return { top: 10, right: 20, left: 20, bottom: 20 }; // Mobile
  else if (width < 1024)
    return { top: 10, right: 25, left: 25, bottom: 25 }; // Tablet
  else return { top: 10, right: 30, left: 30, bottom: 30 }; // Desktop
};
