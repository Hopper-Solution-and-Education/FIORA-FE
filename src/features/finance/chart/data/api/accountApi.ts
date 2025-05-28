import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { GetListAccountRequestDTO, GetListAccountResponseDTO } from '../dto';

export interface IAccountAPI {
  getListAccount(request: GetListAccountRequestDTO): Promise<GetListAccountResponseDTO>;
}

class AccountAPI implements IAccountAPI {
  async getListAccount(request: GetListAccountRequestDTO): Promise<GetListAccountResponseDTO> {
    console.log('====================================');
    console.log(request);
    console.log('====================================');
    return await httpClient.get('/api/accounts/all');
  }
}

// Apply decorators programmatically
decorate(injectable(), AccountAPI);

// Create a factory function
export const createAccountAPI = (): IAccountAPI => {
  return new AccountAPI();
};

export { AccountAPI };
