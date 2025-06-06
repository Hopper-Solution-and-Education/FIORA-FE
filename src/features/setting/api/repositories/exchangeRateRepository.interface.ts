import { CurrencyExchange, ExchangeRateSetting, Prisma } from "@prisma/client";

export interface IExchangeRateRepository {
  createExchangeRate(data: Prisma.ExchangeRateSettingUncheckedCreateInput): Promise<ExchangeRateSetting>;
  findFirstExchangeRate(where: Prisma.ExchangeRateSettingWhereInput): Promise<ExchangeRateSetting | null>;
  findManyExchangeRate(where: Prisma.ExchangeRateSettingWhereInput, options?: Prisma.ExchangeRateSettingFindManyArgs): Promise<ExchangeRateSetting[]>;
  updateExchangeRate(id: string, data: Prisma.ExchangeRateSettingUncheckedUpdateInput): Promise<ExchangeRateSetting>;
  deleteExchangeRate(where: Prisma.ExchangeRateSettingWhereUniqueInput): Promise<void>;
  upsertExchangeRate(
    where: Prisma.ExchangeRateSettingWhereUniqueInput,
    update: Prisma.ExchangeRateSettingUncheckedUpdateInput,
    create: Prisma.ExchangeRateSettingUncheckedCreateInput,
    include?: Prisma.ExchangeRateSettingInclude,
  ): Promise<ExchangeRateSetting>;
  findFirstCurrency(where: Prisma.CurrencyExchangeWhereInput): Promise<CurrencyExchange | null>;
  createCurrency(data: Prisma.CurrencyExchangeUncheckedCreateInput): Promise<CurrencyExchange>;
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
