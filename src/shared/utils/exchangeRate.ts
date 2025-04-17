import dotenv from 'dotenv';
import { BadRequestError } from '../lib';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
dotenv.config();

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '';

export const exchangeRate = async (base: string, symbols: string): Promise<number> => {
  const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${base}`;

  const response = await fetch(url, { method: 'GET' });
  const data = await response.json();

  if (data.result === 'success') {
    return data.conversion_rates[symbols];
  } else {
    throw new BadRequestError('Invalid base currency or symbols');
  }
};

export const convertCurrency = async (
  amount: Prisma.Decimal,
  fromCurrency: string,
  toCurrency: string,
): Promise<Decimal> => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rate = await exchangeRate(fromCurrency, toCurrency);
  if (!rate) {
    throw new BadRequestError('Invalid currency conversion');
  }
  // format to 2 decimal places
  const convertedAmount = amount.toNumber() * rate;
  return new Decimal(convertedAmount.toFixed(2));
};
