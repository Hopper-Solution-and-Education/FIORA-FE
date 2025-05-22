import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import {
  GetFinanceByCategoryRequestDTO,
  GetFinanceByCategoryResponseDTO,
  GetFinanceByDateRequestDTO,
  GetFinanceByDateResponseDTO,
} from '../dto';

export interface IFinanceAPI {
  getFinanceByDate(request: GetFinanceByDateRequestDTO): Promise<GetFinanceByDateResponseDTO>;
  getFinanceByCategory(
    request: GetFinanceByCategoryRequestDTO,
  ): Promise<GetFinanceByCategoryResponseDTO>;
}

class FinanceAPI implements IFinanceAPI {
  async getFinanceByDate(
    request: GetFinanceByDateRequestDTO,
  ): Promise<GetFinanceByDateResponseDTO> {
    return await httpClient.post('/api/finance/chart', request);
  }

  async getFinanceByCategory(
    request: GetFinanceByCategoryRequestDTO,
  ): Promise<GetFinanceByCategoryResponseDTO> {
    return await httpClient.get(`/api/finances?type=${request.type}&filter=${request.filter}`);
  }
}

// Apply decorators programmatically
decorate(injectable(), FinanceAPI);

// Create a factory function
export const createFinanceAPI = (): IFinanceAPI => {
  return new FinanceAPI();
};

export { FinanceAPI };
