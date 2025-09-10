import { IAccountRepository } from '../../domain/repository/accountRepository';
import { accountRepository } from '../../infrashtructure/repositories/accountReposotory';

class AccountUsecase {
  constructor(private accountRepository: IAccountRepository) {}

  async getRoleByUserId(userId: string): Promise<string | null> {
    return await this.accountRepository.getRoleByUserId(userId);
  }
}

export const accountUsecase = new AccountUsecase(accountRepository);
