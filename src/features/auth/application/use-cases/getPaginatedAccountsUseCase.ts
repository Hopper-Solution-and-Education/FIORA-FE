import { Account, Currency, Prisma } from '@prisma/client';
import { AccountRepository } from '../../infrastructure/repositories/accountRepository';
import { convertCurrency } from '@/shared/utils/convertCurrency';

interface GetPaginatedAccountsParams {
  userId: string;
  currency: Currency;
  page: number;
  pageSize: number;
  search?: string;
}

interface AccountWithConvertedBalance extends Omit<Account, 'balance'> {
  balance: string;
}

interface PaginatedAccountsResponse {
  accounts: AccountWithConvertedBalance[];
  total: number;
}

export class GetPaginatedAccountsUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    userId,
    currency,
    page,
    pageSize,
    search,
  }: GetPaginatedAccountsParams): Promise<PaginatedAccountsResponse> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build where clause
    const where: Prisma.AccountWhereInput = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Get total count for pagination
    const total = await this.accountRepository.count(where);

    // Get paginated accounts
    const accounts = await this.accountRepository.findManyWithCondition(where, {
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert balances to requested currency
    const accountsWithConvertedBalance = accounts.map((account) => {
      const convertedBalance = convertCurrency(
        account.balance?.toNumber() || 0,
        account.currency,
        currency,
      );

      return {
        ...account,
        balance: convertedBalance.toString(),
        currency,
      };
    });

    return {
      accounts: accountsWithConvertedBalance,
      total,
    };
  }
}
