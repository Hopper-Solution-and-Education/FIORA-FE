import { Account, Prisma } from '@prisma/client';
import { AccountRepository } from '../../infrastructure/repositories/accountRepository';

interface GetPaginatedAccountsParams {
  userId: string;
  page: number;
  pageSize: number;
  search?: string;
}

interface PaginatedAccountsResponse {
  accounts: Account[];
  total: number;
}

export class GetPaginatedAccountsUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    userId,
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

    return {
      accounts,
      total,
    };
  }
}
