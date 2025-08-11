import { prisma } from '@/config';
import { CurrencyExchange, Prisma } from '@prisma/client';
import { ICurrencySettingRepository } from '../../repositories/currencySettingRepository.interface';

export class CurrencySettingRepository implements ICurrencySettingRepository {
  async findFirstCurrency(
    where: Prisma.CurrencyExchangeWhereInput,
    options?: Prisma.CurrencyExchangeFindFirstArgs,
  ): Promise<CurrencyExchange | null> {
    return prisma.currencyExchange.findFirst({ where, ...options });
  }

  async findManyCurrency(
    where: Prisma.CurrencyExchangeWhereInput,
    options?: Prisma.CurrencyExchangeFindManyArgs,
  ): Promise<CurrencyExchange[]> {
    return prisma.currencyExchange.findMany({ where, ...options });
  }

  async updateCurrency(
    where: Prisma.CurrencyExchangeWhereUniqueInput,
    data: Prisma.CurrencyExchangeUpdateInput,
  ): Promise<CurrencyExchange> {
    return prisma.currencyExchange.update({ where, data });
  }
}

export const currencySettingRepository = new CurrencySettingRepository();
