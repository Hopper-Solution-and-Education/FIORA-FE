import { prisma } from "@/config";
import { CurrencyExchange, ExchangeRateSetting, Prisma } from "@prisma/client";
import { IExchangeRateRepository } from "../../repositories/exchangeRateRepository.interface";

export class ExchangeRateRepository implements IExchangeRateRepository {
  async createExchangeRate(data: Prisma.ExchangeRateSettingUncheckedCreateInput): Promise<ExchangeRateSetting> {
    return prisma.exchangeRateSetting.create({ data });
  }
  async findFirstExchangeRate(where: Prisma.ExchangeRateSettingWhereInput): Promise<ExchangeRateSetting | null> {
    return prisma.exchangeRateSetting.findFirst({ where });
  }
  async findManyExchangeRate(where: Prisma.ExchangeRateSettingWhereInput, options?: Prisma.ExchangeRateSettingFindManyArgs):
    Promise<ExchangeRateSetting[]> {
    return prisma.exchangeRateSetting.findMany({ where, ...options });
  }
  async updateExchangeRate(id: string, data: Prisma.ExchangeRateSettingUncheckedUpdateInput): Promise<ExchangeRateSetting> {
    return prisma.exchangeRateSetting.update({ where: { id }, data });
  }
  async deleteExchangeRate(where: Prisma.ExchangeRateSettingWhereUniqueInput): Promise<void> {
    await prisma.exchangeRateSetting.delete({ where });
  }
  async upsertExchangeRate(where: Prisma.ExchangeRateSettingWhereUniqueInput,
    update: Prisma.ExchangeRateSettingUncheckedUpdateInput,
    create: Prisma.ExchangeRateSettingUncheckedCreateInput,
    include?: Prisma.ExchangeRateSettingInclude): Promise<ExchangeRateSetting> {
    return prisma.exchangeRateSetting.upsert({ where, update, create, include });
  }
  async findFirstCurrency(where: Prisma.CurrencyExchangeWhereInput): Promise<CurrencyExchange | null> {
    return prisma.currencyExchange.findFirst({ where });
  }
  async createCurrency(data: Prisma.CurrencyExchangeUncheckedCreateInput): Promise<CurrencyExchange> {
    return prisma.currencyExchange.create({ data });
  }
}

export const exchangeRateRepository = new ExchangeRateRepository();
