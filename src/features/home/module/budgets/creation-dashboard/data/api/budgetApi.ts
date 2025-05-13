import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import isEmpty from 'lodash/isEmpty';
import {
  BudgetCreateRequestDTO,
  BudgetDeleteRequestDTO,
  BudgetGetByIdRequestDTO,
  BudgetGetRequestDTO,
} from '../dto/request';
import {
  BudgetCreateResponseDTO,
  BudgetDeleteResponseDTO,
  BudgetGetByIdResponseDTO,
  BudgetGetResponseDTO,
} from '../dto/response';

interface IBudgetAPI {
  createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO>;
  getBudget(request: BudgetGetRequestDTO): Promise<BudgetGetResponseDTO>;
  getBudgetById(request: BudgetGetByIdRequestDTO): Promise<BudgetGetByIdResponseDTO>;
}

class BudgetAPI implements IBudgetAPI {
  async createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO> {
    return await httpClient.post(`/api/budgets`, request);
  }

  async getBudget(request: BudgetGetRequestDTO): Promise<BudgetGetResponseDTO> {
    return await httpClient.post(
      `/api/budgets/dashboard`,
      {
        cursor: request.cursor,
        take: request.take,
        search: request.filters ? null : isEmpty(request.search) ? null : request.search,
        filters: request.filters,
      },

      {
        'x-user-currency': request.currency ?? 'VND',
      },
    );
  }

  async getBudgetById(request: BudgetGetByIdRequestDTO): Promise<BudgetGetByIdResponseDTO> {
    return await httpClient.get(`/api/budgets/${request.fiscalYear}?type=${request.type}`);
  }

  async deleteBudget(request: BudgetDeleteRequestDTO): Promise<BudgetDeleteResponseDTO> {
    return await httpClient.delete(`/api/budgets/delete/${request.budgetId}`);
  }
}

// Apply decorators programmatically
decorate(injectable(), BudgetAPI);

// Create a factory function
export const createBudgetAPI = (): IBudgetAPI => {
  return new BudgetAPI();
};

export { BudgetAPI };
export type { IBudgetAPI };
