import { ExchangeRateResponse } from '@/shared/types/exchangeRate';
import { CurrencyExchange, ExchangeRateSetting, Prisma } from '@prisma/client';

export interface IExchangeRateRepository {
  createExchangeRate(
    data: Prisma.ExchangeRateSettingUncheckedCreateInput,
  ): Promise<ExchangeRateSetting>;
  findFirstExchangeRate(
    where: Prisma.ExchangeRateSettingWhereInput,
  ): Promise<ExchangeRateSetting | null>;
  findManyExchangeRate(
    where: Prisma.ExchangeRateSettingWhereInput,
    options?: Prisma.ExchangeRateSettingFindManyArgs,
  ): Promise<ExchangeRateSetting[]>;
  updateExchangeRate(
    id: string,
    data: Prisma.ExchangeRateSettingUncheckedUpdateInput,
  ): Promise<ExchangeRateSetting>;
  deleteExchangeRate(where: Prisma.ExchangeRateSettingWhereUniqueInput): Promise<void>;
  upsertExchangeRate(
    where: Prisma.ExchangeRateSettingWhereUniqueInput,
    update: Prisma.ExchangeRateSettingUncheckedUpdateInput,
    create: Prisma.ExchangeRateSettingUncheckedCreateInput,
    include?: Prisma.ExchangeRateSettingInclude,
  ): Promise<ExchangeRateSetting>;
  findFirstCurrency(where: Prisma.CurrencyExchangeWhereInput): Promise<CurrencyExchange | null>;
  createCurrency(data: Prisma.CurrencyExchangeUncheckedCreateInput): Promise<CurrencyExchange>;
  getLatestUpdateTimestamp(): Promise<Date>;
  populateRateCache(baseCurrency: string): Promise<ExchangeRateResponse>;
  populateCurrencyAbbreviation(): Promise<{ [key: string]: string }>;
}

export interface IUpsertExchangeRateSetting {
  fromCurrency: string;
  toCurrency: string;
  fromValue?: number;
  toValue?: number;
  fromSymbol?: string;
  toSymbol?: string;
}

export type IExchangeRateInclude = {
  FromCurrency: {
    select: {
      id: true;
      name: true;
      symbol: true;
    };
  };
  ToCurrency: {
    select: {
      id: true;
      name: true;
      symbol: true;
    };
  };
};

export type ExchangeRateRepositoryType = Prisma.ExchangeRateSettingGetPayload<{
  include: {
    FromCurrency: { select: { name: true } };
    ToCurrency: { select: { name: true } };
  };
}>;

export type DirectRateRepositoryType = Prisma.ExchangeRateSettingGetPayload<{
  include: {
    FromCurrency: { select: { name: true } };
    ToCurrency: { select: { name: true } };
  };
}>;
