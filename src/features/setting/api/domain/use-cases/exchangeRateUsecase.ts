import { Messages } from '@/shared/constants/message';
import { ExchangeRateSetting, Prisma } from '@prisma/client';
import { exchangeRateRepository } from '../../infrastructure/repositories/exchangeRateRepository';
import {
  IExchangeRateInclude,
  IExchangeRateRepository,
  IUpsertExchangeRateSetting,
} from '../../repositories/exchangeRateRepository.interface';

class ExchangeRateUseCase {
  private exchangeRateRepository: IExchangeRateRepository;

  constructor(exchangeRateRepository: IExchangeRateRepository) {
    this.exchangeRateRepository = exchangeRateRepository;
  }

  async getAllExchangeRate() {
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
        fromValue: Number(exchangeRate.fromValue.toFixed(2)),
        toValue: Number(exchangeRate.toValue.toFixed(2)),
        authorId: exchangeRate.authorId,
        fromCurrencyId: exchangeRate.fromCurrencyId,
        toCurrencyId: exchangeRate.toCurrencyId,
        createdAt: exchangeRate.createdAt,
        updatedAt: exchangeRate.updatedAt,
        createdBy: exchangeRate.createdBy,
        updatedBy: exchangeRate.updatedBy,
        fromCurrency: exchangeRate.FromCurrency.name,
        toCurrency: exchangeRate.ToCurrency.name,
        fromSymbol: exchangeRate.FromCurrency.symbol,
        toSymbol: exchangeRate.ToCurrency.symbol,
      }));
    } catch (error: any) {
      throw new Error(error.message || Messages.GET_EXCHANGE_RATE_FAILED);
    }
  }

  async updateExchangeRate(
    data: Prisma.ExchangeRateSettingUncheckedUpdateInput,
    authorId: string,
  ): Promise<ExchangeRateSetting> {
    try {
      const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
        fromCurrencyId: data.fromCurrencyId as string,
        toCurrencyId: data.toCurrencyId as string,
        authorId,
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
          authorId,
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

      return {
        id: exchangeRate.id,
        fromValue: exchangeRate.fromValue,
        toValue: exchangeRate.toValue,
        authorId: exchangeRate.authorId,
        createdBy: exchangeRate.createdBy,
        updatedBy: exchangeRate.updatedBy,
        createdAt: exchangeRate.createdAt,
        updatedAt: exchangeRate.updatedAt,
        fromCurrency: exchangeRate.FromCurrency.name,
        fromCurrencyId: exchangeRate.FromCurrency.id,
        toCurrency: exchangeRate.ToCurrency.name,
        toCurrencyId: exchangeRate.ToCurrency.id,
        fromSymbol: exchangeRate.FromCurrency.symbol,
        toSymbol: exchangeRate.ToCurrency.symbol,
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
}

export const exchangeRateUseCase = new ExchangeRateUseCase(exchangeRateRepository);
