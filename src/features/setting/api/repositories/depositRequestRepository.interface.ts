import { DepositRequest, Prisma } from '@prisma/client';

export interface IDepositRequestRepository {
  findDepositRequestById(id: string): Promise<DepositRequest | null>;
  findDepositRequest(where: Prisma.DepositRequestWhereInput): Promise<DepositRequest | null>;
  aggregate(aggregate: Prisma.DepositRequestAggregateArgs): Promise<any>;
}
