'use server';

import { AccountType, Currency } from '@prisma/client';
import { AccountCreation } from '../../domain/repositories/accountRepository.interface';
import { AccountRepository } from '../../infrastructure/repositories/accountRepository';
import { Decimal } from '@prisma/client/runtime/library';

export class AccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async create(params: AccountCreation): Promise<void> {
    const { accountName = '', description = '', icon = '', userId } = params;
    await this.accountRepository.create({
      parentId: null,
      type: AccountType.Payment,
      name: accountName,
      description,
      icon,
      userId,
      balance: new Decimal(0),
      currency: Currency.VND,
      limit: new Decimal(0),
    });
  }

  async updateBalance(parentId: string): Promise<void> {
    return await this.accountRepository.updateParentBalance(parentId);
  }
}
