import { Messages } from '@/shared/constants';
import { ExchangeRateSetting, Prisma } from '@prisma/client';
import { currencySettingRepository } from '../../infrastructure/repositories/currencySettingRepository';
import { exchangeRateRepository } from '../../infrastructure/repositories/exchangeRateRepository';
import { ICurrencySettingRepository } from '../../repositories/currencySettingRepository.interface';
import {
  IExchangeRateInclude,
  IExchangeRateRepository,
  IUpsertExchangeRateSetting,
} from '../../repositories/exchangeRateRepository.interface';
class ExchangeRateUseCase {
  private exchangeRateRepository: IExchangeRateRepository;
  private currencySettingRepository: ICurrencySettingRepository;

  constructor(
    exchangeRateRepository: IExchangeRateRepository,
    currencySettingRepository: ICurrencySettingRepository,
  ) {
    this.exchangeRateRepository = exchangeRateRepository;
    this.currencySettingRepository = currencySettingRepository;
  }

  async getAllExchangeRateSetting() {
    try {
      const exchangeRateList =
        ((await this.exchangeRateRepository.findManyExchangeRate(
          {},
          {
            include: {
              FromCurrency: {
                select: {
                  id: true,
                  name: true,
                  symbol: true,
                },
              },
              ToCurrency: {
                select: {
                  id: true,
                  name: true,
                  symbol: true,
                },
              },
            },
          },
        )) as Prisma.ExchangeRateSettingGetPayload<{ include: IExchangeRateInclude }>[]) || [];

      return exchangeRateList.map((exchangeRate) => ({
        id: exchangeRate.id,
        fromCurrencyId: exchangeRate.fromCurrencyId,
        toCurrencyId: exchangeRate.toCurrencyId,
        fromValue: Number(exchangeRate.fromValue.toFixed(2)),
        toValue: Number(exchangeRate.toValue.toFixed(2)),
        createdAt: exchangeRate.createdAt,
        updatedAt: exchangeRate.updatedAt,
        fromCurrency: exchangeRate.FromCurrency.name,
        toCurrency: exchangeRate.ToCurrency.name,
        fromSymbol: exchangeRate.FromCurrency.symbol,
        toSymbol: exchangeRate.ToCurrency.symbol,
      }));
    } catch (error: any) {
      throw new Error(error.message || Messages.GET_EXCHANGE_RATE_FAILED);
    }
  }

  async getAllCurrencyExchangeName() {
    try {
      const currencyExchangeList = await this.currencySettingRepository.findManyCurrency({});
      return currencyExchangeList.map((currencyExchange) => ({
        id: currencyExchange.id,
        name: currencyExchange.name,
        symbol: currencyExchange.symbol,
      }));
    } catch (error: any) {
      throw new Error(error.message || Messages.GET_EXCHANGE_RATE_FAILED);
    }
  }

  async updateExchangeRate(
    data: Prisma.ExchangeRateSettingUncheckedUpdateInput,
  ): Promise<ExchangeRateSetting> {
    try {
      const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
        fromCurrencyId: data.fromCurrencyId as string,
        toCurrencyId: data.toCurrencyId as string,
      });

      if (!foundExchangeRate) {
        throw new Error(Messages.EXCHANGE_RATE_NOT_FOUND);
      }

      return await this.exchangeRateRepository.updateExchangeRate(foundExchangeRate.id, data);
    } catch (error: any) {
      throw new Error(error.message || Messages.UPDATE_EXCHANGE_RATE_FAILED);
    }
  }

  async deleteExchangeRate(data: Prisma.ExchangeRateSettingWhereUniqueInput): Promise<void> {
    const { fromCurrencyId, toCurrencyId } = data;
    try {
      const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
        fromCurrencyId,
        toCurrencyId,
      });

      if (!foundExchangeRate) {
        throw new Error(Messages.EXCHANGE_RATE_NOT_FOUND);
      }

      return await this.exchangeRateRepository.deleteExchangeRate({
        fromCurrencyId_toCurrencyId: {
          fromCurrencyId: foundExchangeRate.fromCurrencyId as string,
          toCurrencyId: foundExchangeRate.toCurrencyId as string,
        },
      });
    } catch (error: any) {
      throw new Error(error.message || Messages.DELETE_EXCHANGE_RATE_FAILED);
    }
  }

  async upsertExchangeRate(data: IUpsertExchangeRateSetting, authorId: string) {
    try {
      let fromCurrency = await this.exchangeRateRepository.findFirstCurrency({
        name: data.fromCurrency,
      });
      let toCurrency = await this.exchangeRateRepository.findFirstCurrency({
        name: data.toCurrency,
      });

      if (!fromCurrency) {
        fromCurrency = await this.exchangeRateRepository.createCurrency({
          name: data.fromCurrency,
          symbol: data.fromSymbol as string,
        });
      }

      if (!toCurrency) {
        toCurrency = await this.exchangeRateRepository.createCurrency({
          name: data.toCurrency,
          symbol: data.toSymbol as string,
        });
      }

      const exchangeRate = (await this.exchangeRateRepository.upsertExchangeRate(
        {
          fromCurrencyId_toCurrencyId: {
            fromCurrencyId: fromCurrency?.id as string,
            toCurrencyId: toCurrency?.id as string,
          },
        },
        {
          fromValue: data.fromValue as number,
          toValue: data.toValue as number,
          updatedBy: authorId,
        },
        {
          fromCurrencyId: fromCurrency?.id as string,
          toCurrencyId: toCurrency?.id as string,
          fromValue: data.fromValue,
          toValue: data.toValue,
          createdBy: authorId,
        },
        {
          FromCurrency: {
            select: {
              id: true,
              name: true,
              symbol: true,
            },
          },
          ToCurrency: {
            select: {
              id: true,
              name: true,
              symbol: true,
            },
          },
        },
      )) as Prisma.ExchangeRateSettingGetPayload<{
        include: {
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
      }>;

      const updatedFromCurrency = await this.currencySettingRepository.updateCurrency(
        { id: fromCurrency?.id as string },
        {
          name: data.fromCurrency,
          symbol: data.fromSymbol as string,
        },
      );

      const updatedToCurrency = await this.currencySettingRepository.updateCurrency(
        { id: toCurrency?.id as string },
        {
          name: data.toCurrency,
          symbol: data.toSymbol as string,
        },
      );

      return {
        id: exchangeRate.id,
        fromValue: exchangeRate.fromValue,
        toValue: exchangeRate.toValue,
        createdBy: exchangeRate.createdBy,
        updatedBy: exchangeRate.updatedBy,
        createdAt: exchangeRate.createdAt,
        updatedAt: exchangeRate.updatedAt,
        fromCurrency: updatedFromCurrency.name,
        fromCurrencyId: updatedFromCurrency.id,
        fromSymbol: updatedFromCurrency.symbol,
        toCurrency: updatedToCurrency.name,
        toCurrencyId: updatedToCurrency.id,
        toSymbol: updatedToCurrency.symbol,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(Messages.EXCHANGE_RATE_DUPLICATED_FIELDS);
        }
      }
      throw new Error(Messages.UPDATE_EXCHANGE_RATE_FAILED);
    }
  }

  async fetchCurrencyFromBaseCurrency(baseCurrency: string) {
    try {
      const currency = await this.exchangeRateRepository.findFirstCurrency({
        name: baseCurrency,
      });

      if (!currency) {
        throw new Error(Messages.CURRENCY_NOT_FOUND);
      }

      const [currencyAbbreviation, response] = await Promise.all([
        this.exchangeRateRepository.populateCurrencyAbbreviation(),
        this.exchangeRateRepository.populateRateCache(baseCurrency),
      ]);

      return {
        ...response,
        currency_suffix: currencyAbbreviation,
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || Messages.GET_CURRENCY_FAILED);
    }
  }
}

export const exchangeRateUseCase = new ExchangeRateUseCase(
  exchangeRateRepository,
  currencySettingRepository,
);
