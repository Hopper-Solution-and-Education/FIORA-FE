import { decorate, injectable } from 'inversify';
import { IAccountRepository } from '../../data/repositories';
import { GetListAccountRequest, GetListAccountResponse } from '../entities';

export interface IGetAllAccountUseCase {
  execute(params: GetListAccountRequest): Promise<GetListAccountResponse>;
}

export class getAllAccountsUseCase implements IGetAllAccountUseCase {
  private accountRepository: IAccountRepository;

  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  execute(params: GetListAccountRequest): Promise<GetListAccountResponse> {
    return this.accountRepository.getListAccount(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), getAllAccountsUseCase);

// Create a factory function
export const createGetAllAccountsUseCase = (
  accountRepository: IAccountRepository,
): IGetAllAccountUseCase => {
  return new getAllAccountsUseCase(accountRepository);
};
