import { iconOptions } from '@/shared/constants/data';
import { clsx, type ClassValue } from 'clsx';
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
