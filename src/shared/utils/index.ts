import { iconOptions } from '@/shared/constants/data';
import { clsx, type ClassValue } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const useGetIconLabel = (icon: string): string => {
  return (
    iconOptions
      .find((option) => option.options.some((o) => o.value === icon))
      ?.options.find((o) => o.value === icon)?.label || ''
  );
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);

export const convertUSDToVND = (amountUSD: number) => {
  const exchangeRate = 24800; // Fixed exchange rate
  const amountVND = amountUSD * exchangeRate;

  // Format the output with Vietnamese number formatting
  return amountVND.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const convertVNDToUSD = (amountVND: number) => {
  const exchangeRate = 24800; // Fixed exchange rate
  const amountUSD = amountVND / exchangeRate;

  // Format the output with USD number formatting
  return amountUSD.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Dynamic chart margins based on screen width
export const getChartMargins = (width: number) => {
  if (width < 640) return { top: 10, right: 20, left: 60, bottom: 20 };
  else if (width < 1024) return { top: 10, right: 25, left: 80, bottom: 25 };
  else return { top: 10, right: 30, left: 100, bottom: 30 };
};
