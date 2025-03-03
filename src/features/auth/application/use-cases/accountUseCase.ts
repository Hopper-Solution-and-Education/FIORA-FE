'use server';

import { AccountType, Currency } from '@prisma/client';
import { AccountCreation } from '../../domain/repositories/accountRepository.interface';
import { AccountRepository } from '../../infrastructure/repositories/accountRepository';
import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestError } from '@/lib/errors';
import { validateAccount } from '@/shared/validation/accountValidation';

export class AccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async create(params: AccountCreation): Promise<void> {
    const { accountName = '', description = '', icon = '', userId, parentId, type } = params;
    validateAccount(type, new Decimal(0), new Decimal(0));
    if (parentId) {
      const parentAccount = await this.accountRepository.findById(parentId);
      if (!parentAccount || parentAccount.type !== params.type) {
        throw new BadRequestError('Parent account not found or invalid type');
      }
    }
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
