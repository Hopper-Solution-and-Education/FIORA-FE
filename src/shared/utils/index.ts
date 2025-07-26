import { formatFIORACurrency, getCurrencySymbol } from '@/config/FIORANumberFormat';
import { iconOptions } from '@/shared/constants/data';
import { Currency } from '@/shared/types';
import { Filter } from '@growthbook/growthbook';
import { Prisma } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCY } from '../constants';
import { OrderByFields } from '../types/Common.types';

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

export const formatCurrency = (
  value: number,
  currency: string = CURRENCY.VND,
  isFullCurrencyDisplay: boolean = true,
) => {
  try {
    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);
    let formattedValue = absValue;
    let suffix = '';

    if (!isFullCurrencyDisplay) {
      // Compact/shortened notation
      if (absValue >= 1_000_000_000_000) {
        formattedValue = absValue / 1_000_000_000_000;
        suffix = 'T';
      } else if (absValue >= 1_000_000_000) {
        formattedValue = absValue / 1_000_000_000;
        suffix = 'B';
      } else if (absValue >= 1_000_000) {
        formattedValue = absValue / 1_000_000;
        suffix = 'M';
      } else if (absValue >= 1_000) {
        formattedValue = absValue / 1_000;
        suffix = 'K';
      }
    }

    // Use FIORANumberFormat for currency formatting
    const formatted = formatFIORACurrency(formattedValue, currency as Currency);

    if (!isFullCurrencyDisplay && suffix) {
      const currencySymbol = getCurrencySymbol(currency as Currency);
      if (currency === CURRENCY.USD) {
        // For USD, move the suffix after the number but keep $ at the start
        const numericPart = formatted.replace('$', '').trim();
        return `${sign}$${numericPart}${suffix}`;
      } else if (currency === CURRENCY.VND) {
        // For VND, split at ₫ and place suffix before the currency symbol
        const parts = formatted.split('₫').map((part) => part.trim());
        return `${sign}${parts[0]}${suffix} ₫${parts[1] || ''}`;
      } else {
        // For FX and other currencies, place suffix before the currency symbol
        const parts = formatted.split(currencySymbol).map((part) => part.trim());
        return `${sign}${parts[0]}${suffix} ${currencySymbol}${parts[1] || ''}`;
      }
    }

    // Full currency display or no suffix
    return sign ? `-${formatted}` : formatted;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return value.toString();
  }
};

export const convertVNDToUSD = (amountVND: number): number => {
  const exchangeRate = 25000; // 1 USD = 25000 VND
  return amountVND / exchangeRate;
};

export const convertUSDToVND = (amountUSD: number): number => {
  const exchangeRate = 25000; // 1 USD = 25000 VND
  return amountUSD * exchangeRate;
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
    if (restFilters.date) {
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
      whereClause.type = {
        in: [restFilters.type],
      };
    }
  }

  // From Account filter
  if (restFilters.fromAccount) {
    whereClause.fromAccount = {
      name: {
        equals: restFilters.fromAccount,
      },
    };
  }

  // To Account filter
  if (restFilters.toAccount) {
    whereClause.toAccount = {
      name: {
        equals: restFilters.toAccount,
      },
    };
  }
  // Partner filter
  if (restFilters.partner) {
    whereClause.partner = {
      name: {
        equals: restFilters.partner,
      },
    };
  }

  return whereClause;
}

export function buildOrderByTransaction(orderBy: Record<string, any>): Record<string, any> {
  const orderByClause: Record<string, any> = [];

  if (orderBy['date']) {
    // add object to array
    orderByClause.push({ date: orderBy.date });
  }
  // Type filter (supports single or multiple types)
  if (orderBy['type']) {
    orderByClause.push({ type: orderBy.type });
  }

  // From Account filter
  if (orderBy['fromAccount']) {
    orderByClause.push({ fromAccount: { name: orderBy.fromAccount } });
  }

  // To Account filter
  if (orderBy['toAccount']) {
    orderByClause.push({ toAccount: { name: orderBy.toAccount } });
  }
  // Partner filter
  if (orderBy['partner']) {
    orderByClause.partner = orderBy.partner;
  }

  if (orderBy['amount']) {
    orderByClause.push({ amount: orderBy.amount });
  }

  return orderByClause;
}

export function buildOrderByTransactionV2(
  orderBy: OrderByFields,
): Prisma.TransactionOrderByWithRelationInput {
  const orderByObj = Object.entries(orderBy).reduce((acc, [key, value]) => {
    if (!value) return acc;

    if (key === 'fromAccount' || key === 'toAccount') {
      acc[key] = { name: value };
    } else {
      acc[key as keyof typeof Prisma.TransactionOrderByRelevanceFieldEnum] = value;
    }

    return acc;
  }, {} as Prisma.TransactionOrderByWithRelationInput);

  return orderByObj;
}
export function buildWhereClause(filters: Filter) {
  const whereClause: any = {};

  if (!filters) {
    return whereClause;
  }

  for (const [key, value] of Object.entries(filters)) {
    if (key === 'AND' || key === 'OR' || key === 'NOT') {
      whereClause[key] = value.map((subFilter: Filter) => buildWhereClause(subFilter));
    } else if (typeof key === 'object' && !Array.isArray(key)) {
      // incorporate conditional operators like contains, startsWith
      const [operator, operand] = Object.entries(key)[0];
      whereClause[key] = { [operator]: operand };
    } else {
      whereClause[key] = value;
    }
  }

  return whereClause;
}

export const isImageUrl = (str: string): boolean => {
  return str.startsWith('http') || str.startsWith('https') || str.startsWith('blob:');
};
