import { decorate, injectable } from 'inversify';
import { GetListAccountRequest, GetListAccountResponse } from '../../domain/entities';
import { IAccountAPI } from '../api/accountApi';
import { AccountMapper } from '../mapper';

export interface IAccountRepository {
  getListAccount(request: GetListAccountRequest): Promise<GetListAccountResponse>;
}

export class AccountRepository implements IAccountRepository {
  private accountAPI: IAccountAPI;

  constructor(accountAPI: IAccountAPI) {
    this.accountAPI = accountAPI;
  }

  async getListAccount(request: GetListAccountRequest): Promise<GetListAccountResponse> {
    const requestAPI = AccountMapper.toGetListAccountRequestDTO(request);
    const response = await this.accountAPI.getListAccount(requestAPI);
    return AccountMapper.toGetListAccountResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), AccountRepository);

// Create a factory function
export const createAccountRepository = (accountAPI: IAccountAPI): IAccountRepository => {
  return new AccountRepository(accountAPI);
};
