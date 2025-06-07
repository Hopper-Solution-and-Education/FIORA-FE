import { ExchangeRateSetting, Prisma } from "@prisma/client";

export interface IExchangeRateRepository {
    createExchangeRate(data: Prisma.ExchangeRateSettingUncheckedCreateInput): Promise<ExchangeRateSetting>;
    findFirstExchangeRate(where: Prisma.ExchangeRateSettingWhereInput): Promise<ExchangeRateSetting | null>;
    findManyExchangeRate(where: Prisma.ExchangeRateSettingWhereInput): Promise<ExchangeRateSetting[]>;
    updateExchangeRate(id: string, data: Prisma.ExchangeRateSettingUncheckedUpdateInput): Promise<ExchangeRateSetting>;
    deleteExchangeRate(id: string): Promise<void>;
}