import { prisma } from '@/config';
import { DepositRequest, Prisma } from '@prisma/client';
import { IDepositRequestRepository } from '../../repositories/depositRequestRepository.interface';

export class DepositRequestRepository implements IDepositRequestRepository {
  async findDepositRequestById(id: string): Promise<DepositRequest | null> {
    return prisma.depositRequest.findUnique({ where: { id } });
  }

  async findDepositRequest(where: Prisma.DepositRequestWhereInput): Promise<DepositRequest | null> {
    return prisma.depositRequest.findFirst({ where });
  }

  async aggregate(aggregate: Prisma.DepositRequestAggregateArgs): Promise<any> {
    return prisma.depositRequest.aggregate(aggregate);
  }
}

export const depositRequestRepository = new DepositRequestRepository();
