import { CurrencyExchange, Prisma } from '@prisma/client';

export interface ICurrencySettingRepository {
  findFirstCurrency(where: Prisma.CurrencyExchangeWhereInput): Promise<CurrencyExchange | null>;
  findManyCurrency(
    where: Prisma.CurrencyExchangeWhereInput,
    options?: Prisma.CurrencyExchangeFindManyArgs,
  ): Promise<CurrencyExchange[]>;
}
