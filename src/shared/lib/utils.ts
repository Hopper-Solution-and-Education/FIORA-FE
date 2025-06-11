import { ResponseObject } from '@/store/types/responseObject.type';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createResponse<T>(
  statusCode: number,
  status: string,
  data: T,
  message: string,
): ResponseObject {
  return {
    statusCode,
    status,
    data,
    message,
  };
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  error?: { [key: string]: string },
): ResponseObject {
  return {
    statusCode,
    status: 'error',
    data: null,
    message,
    error: error,
  };
}

export const isUrl = (value: string) => /^(https?|blob):\/\//.test(value);
export const isImageFile = (value: string) => {
  if (value.startsWith('blob:')) return true;
  return /\.(png|jpe?g|svg|gif|webp)$/i.test(value);
};

export const formatters: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  VND: new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
};
