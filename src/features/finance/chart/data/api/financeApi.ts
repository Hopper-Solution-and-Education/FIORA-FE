import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { GetFinanceByDateRequestDTO, GetFinanceByDateResponseDTO } from '../dto';

export interface IFinanceAPI {
  getFinanceByDate(request: GetFinanceByDateRequestDTO): Promise<GetFinanceByDateResponseDTO>;
}

class FinanceAPI implements IFinanceAPI {
  async getFinanceByDate(
    request: GetFinanceByDateRequestDTO,
  ): Promise<GetFinanceByDateResponseDTO> {
    return await httpClient.post('/api/budgets/finance/chart', request);
  }
}

// Apply decorators programmatically
decorate(injectable(), FinanceAPI);

// Create a factory function
export const createFinanceAPI = (): IFinanceAPI => {
  return new FinanceAPI();
};

export { FinanceAPI };
