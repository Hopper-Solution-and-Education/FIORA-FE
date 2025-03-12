import { iconOptions } from '@/shared/constants/data';

export const useGetIconLabel = (icon: string): string => {
  return (
    iconOptions
      .find((option) => option.options.some((o) => o.value === icon))
      ?.options.find((o) => o.value === icon)?.label || ''
  );
};

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
