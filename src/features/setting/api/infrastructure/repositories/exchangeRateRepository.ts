import { prisma } from "@/config";
import { IExchangeRateRepository } from "../../repositories/exchangeRateRepository.interface";
import { ExchangeRateSetting, Prisma } from "@prisma/client";

export class ExchangeRateRepository implements IExchangeRateRepository {
    async createExchangeRate(data: Prisma.ExchangeRateSettingUncheckedCreateInput): Promise<ExchangeRateSetting> {
        return prisma.exchangeRateSetting.create({ data });
    }
    async findFirstExchangeRate(where: Prisma.ExchangeRateSettingWhereInput): Promise<ExchangeRateSetting | null> {
        return prisma.exchangeRateSetting.findFirst({ where });
    }
    async findManyExchangeRate(where: Prisma.ExchangeRateSettingWhereInput): Promise<ExchangeRateSetting[]> {
        return prisma.exchangeRateSetting.findMany({ where });
    }
    async updateExchangeRate(id: string, data: Prisma.ExchangeRateSettingUncheckedUpdateInput): Promise<ExchangeRateSetting> {
        return prisma.exchangeRateSetting.update({ where: { id }, data });
    }
    async deleteExchangeRate(id: string): Promise<void> {
        await prisma.exchangeRateSetting.delete({ where: { id } });
    }
}

export const exchangeRateRepository = new ExchangeRateRepository();