import { prisma } from '@/config';
import { IDepositRequestRepository } from '../../repositories/depositRequestRepository.interface';
import { DepositRequest, Prisma } from '@prisma/client';

export class DepositRequestRepository implements IDepositRequestRepository {
  async findDepositRequestById(id: string): Promise<DepositRequest | null> {
    return prisma.depositRequest.findUnique({ where: { id } });
  }

  async findDepositRequest(where: Prisma.DepositRequestWhereInput): Promise<DepositRequest | null> {
    return prisma.depositRequest.findFirst({ where });
  }
}

export const depositRequestRepository = new DepositRequestRepository();
