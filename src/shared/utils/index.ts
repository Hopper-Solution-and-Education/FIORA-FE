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

export const calculateAvailableLimit = (limit: string, balance: string): string => {
  const limitValue = Number.parseFloat(limit) || 0;
  const balanceValue = Number.parseFloat(balance) || 0;
  return (limitValue + balanceValue).toFixed(2);
};

// Helper function to build Prisma where clause
export function buildWhereTransactionClause(restFilters: Record<string, any>): Record<string, any> {
  const whereClause: Record<string, any> = {
    isDeleted: false,
  };

  if (restFilters.date) {
    if (restFilters.date instanceof Date) {
      whereClause.date = {
        equals: new Date(restFilters.date),
      };
    } else if (typeof restFilters.date === 'object') {
      whereClause.date = {};
      if (restFilters.date.from) {
        whereClause.date.gte = new Date(restFilters.date.from);
      }
      if (restFilters.date.to) {
        whereClause.date.lte = new Date(restFilters.date.to);
      }
    }
  }

  // Type filter (supports single or multiple types)
  if (restFilters.type) {
    if (Array.isArray(restFilters.type)) {
      whereClause.type = {
        in: restFilters.type,
      };
    } else {
      whereClause.type = restFilters.type;
    }
  }

  // From Account filter
  if (restFilters.fromAccount) {
    whereClause.fromAccount = {
      name: {
        equals: restFilters.fromAccount,
        mode: 'insensitive',
      },
    };
  }

  // To Account filter
  if (restFilters.toAccount) {
    whereClause.toAccount = {
      name: {
        equals: restFilters.toAccount,
        mode: 'insensitive',
      },
    };
  }

  // Partner filter
  if (restFilters.partner) {
    whereClause.partner = {
      name: {
        equals: restFilters.partner,
        mode: 'insensitive',
      },
    };
  }

  return whereClause;
}
