import { decorate, injectable } from 'inversify';
import { IFinanceAPI } from '../api/financeApi';
import { FinanceMapper } from '../mapper';
import {
  GetFinanceByCategoryRequest,
  GetFinanceByCategoryResponse,
  GetFinanceByDateRequest,
  GetFinanceByDateResponse,
  GetFinanceWithFilterRequest,
  GetFinanceWithFilterResponse,
} from '../../domain/entities';

export interface IFinanceRepository {
  getFinanceByDate(request: GetFinanceByDateRequest): Promise<GetFinanceByDateResponse>;
  getFinanceByCategory(request: GetFinanceByCategoryRequest): Promise<GetFinanceByCategoryResponse>;
  getFinanceWithFilter(request: GetFinanceWithFilterRequest): Promise<GetFinanceWithFilterResponse>;
}

export class FinanceRepository implements IFinanceRepository {
  private financeAPI: IFinanceAPI;

  constructor(financeAPI: IFinanceAPI) {
    this.financeAPI = financeAPI;
  }

  async getFinanceByDate(request: GetFinanceByDateRequest): Promise<GetFinanceByDateResponse> {
    const requestAPI = FinanceMapper.toGetFinanceByDateRequestDTO(request);
    const response = await this.financeAPI.getFinanceByDate(requestAPI);
    return FinanceMapper.toGetFinanceByDateResponse(response);
  }

  async getFinanceByCategory(
    request: GetFinanceByCategoryRequest,
  ): Promise<GetFinanceByCategoryResponse> {
    const requestAPI = FinanceMapper.toGetFinanceByCategoryRequest(request);
    const response = await this.financeAPI.getFinanceByCategory(requestAPI);
    return FinanceMapper.toGetFinanceByCategoryResponse(response);
  }

  async getFinanceWithFilter(
    request: GetFinanceWithFilterRequest,
  ): Promise<GetFinanceWithFilterResponse> {
    const requestAPI = FinanceMapper.toGetFinanceWithFilterRequest(request);
    const response = await this.financeAPI.getFinanceWithFilter(requestAPI);
    return FinanceMapper.toGetFinanceWithFilterResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), FinanceRepository);

// Create a factory function
export const createFinanceRepository = (financeAPI: IFinanceAPI): IFinanceRepository => {
  return new FinanceRepository(financeAPI);
};
