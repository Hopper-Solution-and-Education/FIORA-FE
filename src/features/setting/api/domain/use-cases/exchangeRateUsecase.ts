import { IExchangeRateRepository } from '../../repositories/exchangeRateRepository.interface';
import { exchangeRateRepository } from '../../infrastructure/repositories/exchangeRateRepository';
import { ExchangeRateSetting, Prisma } from '@prisma/client';
import { Messages } from '@/shared/constants/message';
import { prisma } from '@/config';
import { ExchangeRateUpsertParams } from '@/shared/types/exchangeRate';
import { BadRequestError } from '@/shared/lib';

class ExchangeRateUseCase {
  private exchangeRateRepository: IExchangeRateRepository;

  constructor(exchangeRateRepository: IExchangeRateRepository) {
    this.exchangeRateRepository = exchangeRateRepository;
  }

  async createExchangeRate(
    data: Prisma.ExchangeRateSettingUncheckedCreateInput,
    authorId: string,
  ): Promise<ExchangeRateSetting> {
    const { fromCurrency, toCurrency, fromSymbol, toSymbol, fromValue, toValue } = data;

    if (!fromCurrency || !toCurrency || !fromSymbol || !toSymbol || !fromValue || !toValue) {
      throw new Error(Messages.INVALID_EXCHANGE_RATE_DATA);
    }

    try {
      const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
        authorId,
        OR: [{ fromCurrency, toCurrency }],
      });

      if (foundExchangeRate) {
        throw new Error(Messages.EXCHANGE_RATE_DUPLICATED_FIELDS);
      }

      return await this.exchangeRateRepository.createExchangeRate({
        ...data,
        authorId,
        createdBy: authorId,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(Messages.EXCHANGE_RATE_DUPLICATED_FIELDS);
        }
      }
      throw new Error(Messages.CREATE_EXCHANGE_RATE_FAILED);
    }
  }

  async getExchangeRateById(id: string, authorId: string): Promise<ExchangeRateSetting> {
    const exchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({ id, authorId });
    if (!exchangeRate) {
      throw new BadRequestError(Messages.EXCHANGE_RATE_NOT_FOUND);
    }
    return exchangeRate;
  }

  async getAllExchangeRate(authorId: string): Promise<ExchangeRateSetting[]> {
    try {
      return (await this.exchangeRateRepository.findManyExchangeRate({ authorId })) || [];
    } catch (error: any) {
      throw new Error(error.message || Messages.GET_EXCHANGE_RATE_FAILED);
    }
  }

  async upsertExchangeRate(
    data: ExchangeRateUpsertParams,
    authorId: string,
  ): Promise<ExchangeRateSetting> {
    const { fromCurrency, toCurrency } = data;
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const upsertExchangeRate = await tx.exchangeRateSetting.upsert({
          where: {
            fromCurrency_toCurrency_authorId: {
              fromCurrency,
              toCurrency,
              authorId,
            },
          },
          update: {
            ...data,
            fromValue: new Prisma.Decimal(data.fromValue),
            toValue: new Prisma.Decimal(data.toValue),
            updatedBy: authorId,
          },
          create: {
            ...data,
            fromValue: new Prisma.Decimal(data.fromValue),
            toValue: new Prisma.Decimal(data.toValue),
            authorId,
            createdBy: authorId,
          },
        });

        return upsertExchangeRate;
      });
    } catch (error: any) {
      throw new Error(error.message || Messages.UPDATE_EXCHANGE_RATE_FAILED);
    }
  }

  async deleteExchangeRate(id: string, authorId: string): Promise<void> {
    try {
      const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
        id,
        authorId,
      });

      if (!foundExchangeRate) {
        throw new Error(Messages.EXCHANGE_RATE_NOT_FOUND);
      }

      return await this.exchangeRateRepository.deleteExchangeRate(id);
    } catch (error: any) {
      throw new Error(error.message || Messages.DELETE_EXCHANGE_RATE_FAILED);
    }
  }
}

export const exchangeRateUseCase = new ExchangeRateUseCase(exchangeRateRepository);
