import { prisma } from '@/config';
import { FIXED_NUMBER_OF_DECIMALS } from '@/shared/constants';
import { ExchangeRateResponse } from '@/shared/types/exchangeRate';
import { Currency, CurrencyExchange, ExchangeRateSetting, Prisma } from '@prisma/client';
import {
  DirectRateRepositoryType,
  ExchangeRateRepositoryType,
  IExchangeRateRepository,
} from '../../repositories/exchangeRateRepository.interface';
import { currencySettingRepository } from './currencySettingRepository';

export class ExchangeRateRepository implements IExchangeRateRepository {
  async createExchangeRate(
    data: Prisma.ExchangeRateSettingUncheckedCreateInput,
  ): Promise<ExchangeRateSetting> {
    return prisma.exchangeRateSetting.create({ data });
  }
  async findFirstExchangeRate(
    where: Prisma.ExchangeRateSettingWhereInput,
    options?: Prisma.ExchangeRateSettingFindFirstArgs,
  ): Promise<ExchangeRateSetting | null> {
    return prisma.exchangeRateSetting.findFirst({ where, ...options });
  }
  async findManyExchangeRate(
    where: Prisma.ExchangeRateSettingWhereInput,
    options?: Prisma.ExchangeRateSettingFindManyArgs,
  ): Promise<ExchangeRateSetting[]> {
    return prisma.exchangeRateSetting.findMany({ where, ...options });
  }
  async updateExchangeRate(
    id: string,
    data: Prisma.ExchangeRateSettingUncheckedUpdateInput,
  ): Promise<ExchangeRateSetting> {
    return prisma.exchangeRateSetting.update({ where: { id }, data });
  }
  async deleteExchangeRate(where: Prisma.ExchangeRateSettingWhereUniqueInput): Promise<void> {
    await prisma.exchangeRateSetting.delete({ where });
  }
  async upsertExchangeRate(
    where: Prisma.ExchangeRateSettingWhereUniqueInput,
    update: Prisma.ExchangeRateSettingUncheckedUpdateInput,
    create: Prisma.ExchangeRateSettingUncheckedCreateInput,
    include?: Prisma.ExchangeRateSettingInclude,
  ): Promise<ExchangeRateSetting> {
    return prisma.exchangeRateSetting.upsert({ where, update, create, include });
  }
  async findFirstCurrency(
    where: Prisma.CurrencyExchangeWhereInput,
  ): Promise<CurrencyExchange | null> {
    return prisma.currencyExchange.findFirst({ where });
  }
  async createCurrency(
    data: Prisma.CurrencyExchangeUncheckedCreateInput,
  ): Promise<CurrencyExchange> {
    return prisma.currencyExchange.create({ data });
  }

  async getLatestUpdateTimestamp(): Promise<Date> {
    const [latestRate, latestCurrency] = await Promise.all([
      prisma.exchangeRateSetting.findFirst({
        select: { updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.currencyExchange.findFirst({
        select: { updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const latestRateUpdate = latestRate?.updatedAt || new Date(0);
    const latestCurrencyUpdate = latestCurrency?.updatedAt || new Date(0);
    return latestRateUpdate > latestCurrencyUpdate ? latestRateUpdate : latestCurrencyUpdate;
  }

  async populateRateCache(baseCurrency: string): Promise<ExchangeRateResponse> {
    const [exchangeRates, currencies, latestUpdate] = await Promise.all([
      this.findManyExchangeRate(
        {},
        {
          include: {
            FromCurrency: { select: { name: true } },
            ToCurrency: { select: { name: true } },
          },
        },
      ),
      currencySettingRepository.findManyCurrency(
        {},
        {
          select: { name: true },
        },
      ),
      this.getLatestUpdateTimestamp(),
    ]);

    const conversionRates: { [key: string]: number } = {};

    // Process direct rates
    for (const rate of exchangeRates as ExchangeRateRepositoryType[]) {
      const fromName = rate.FromCurrency.name;
      const toName = rate.ToCurrency.name;
      const rateValue = Number(rate.toValue) / Number(rate.fromValue);

      if (fromName === baseCurrency) {
        conversionRates[toName] = Number(rateValue.toFixed(FIXED_NUMBER_OF_DECIMALS));
      } else if (toName === baseCurrency) {
        const inverseRate = 1 / rateValue;
        conversionRates[fromName] = Number(inverseRate.toFixed(FIXED_NUMBER_OF_DECIMALS));
      }
    }

    // Calculate indirect rates through USD
    const usdRates: { [key: string]: number } = {};
    for (const rate of exchangeRates as ExchangeRateRepositoryType[]) {
      if (rate.ToCurrency.name === Currency.USD) {
        usdRates[rate.FromCurrency.name] = Number(
          (Number(rate.toValue) / Number(rate.fromValue)).toFixed(FIXED_NUMBER_OF_DECIMALS),
        );
      } else if (rate.FromCurrency.name === Currency.USD) {
        usdRates[rate.ToCurrency.name] = Number(
          (Number(rate.fromValue) / Number(rate.toValue)).toFixed(FIXED_NUMBER_OF_DECIMALS),
        );
      }
    }

    for (const currency of currencies) {
      const name = currency.name;
      if (name === baseCurrency || conversionRates[name]) continue;

      const baseToUSD = usdRates[baseCurrency];
      const currencyToUSD = usdRates[name];
      if (baseToUSD && currencyToUSD) {
        const indirectRate = currencyToUSD / baseToUSD;
        conversionRates[name] = Number(indirectRate.toFixed(FIXED_NUMBER_OF_DECIMALS));
      }
    }

    // Add base currency
    conversionRates[baseCurrency] = 1;

    // Construct response
    return {
      time_last_update_unix: Math.floor(latestUpdate.getTime() / 1000),
      time_last_update_utc: latestUpdate.toUTCString(),
      base_code: baseCurrency,
      conversion_rates: conversionRates,
    };
  }

  /**
   * Update a single currency rate in the Redis cache
   */
  async updateSingleRate(baseCurrency: string, targetCurrency: string) {
    // Fetch direct rate from ExchangeRateSetting
    let rate: number | null = null;
    const directRate = (await this.findFirstExchangeRate(
      {
        OR: [
          { FromCurrency: { name: baseCurrency }, ToCurrency: { name: targetCurrency } },
          { FromCurrency: { name: targetCurrency }, ToCurrency: { name: baseCurrency } },
        ],
      },
      {
        include: {
          FromCurrency: { select: { name: true } },
          ToCurrency: { select: { name: true } },
        },
      },
    )) as DirectRateRepositoryType;

    if (directRate) {
      const rateValue = Number(directRate.toValue) / Number(directRate.fromValue);
      rate = directRate.FromCurrency.name === baseCurrency ? rateValue : 1 / rateValue;
    } else {
      // Calculate indirect rate via USD
      const usdRates = await prisma.exchangeRateSetting.findMany({
        where: {
          OR: [
            { FromCurrency: { name: 'United States Dollar' } },
            { ToCurrency: { name: 'United States Dollar' } },
          ],
        },
        include: {
          FromCurrency: { select: { name: true } },
          ToCurrency: { select: { name: true } },
        },
      });

      let baseToUSD: number | null = null;
      let targetToUSD: number | null = null;
      for (const usdRate of usdRates) {
        const rateValue = Number(usdRate.toValue) / Number(usdRate.fromValue);
        if (
          usdRate.FromCurrency.name === baseCurrency &&
          usdRate.ToCurrency.name === Currency.USD
        ) {
          baseToUSD = rateValue;
        } else if (
          usdRate.FromCurrency.name === Currency.USD &&
          usdRate.ToCurrency.name === baseCurrency
        ) {
          baseToUSD = 1 / rateValue;
        } else if (
          usdRate.FromCurrency.name === targetCurrency &&
          usdRate.ToCurrency.name === Currency.USD
        ) {
          targetToUSD = rateValue;
        } else if (
          usdRate.FromCurrency.name === Currency.USD &&
          usdRate.ToCurrency.name === targetCurrency
        ) {
          targetToUSD = 1 / rateValue;
        }
      }

      if (baseToUSD && targetToUSD) {
        rate = targetToUSD / baseToUSD;
      }
    }

    if (rate !== null) {
      return Number(rate.toFixed(FIXED_NUMBER_OF_DECIMALS));
    } else {
      throw new Error(`No rate found for ${baseCurrency} to ${targetCurrency}`);
    }
  }
}

export const exchangeRateRepository = new ExchangeRateRepository();
