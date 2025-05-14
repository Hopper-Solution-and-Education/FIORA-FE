import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import isEmpty from 'lodash/isEmpty';
import {
  BudgetCreateRequestDTO,
  BudgetDeleteRequestDTO,
  BudgetGetByYearAndTypeRequestDTO,
  BudgetGetRequestDTO,
  BudgetUpdateRequestDTO,
} from '../dto/request';
import {
  BudgetCreateResponseDTO,
  BudgetDeleteResponseDTO,
  BudgetGetByYearAndTypeResponseDTO,
  BudgetGetResponseDTO,
  BudgetUpdateResponseDTO,
} from '../dto/response';

interface IBudgetAPI {
  createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO>;
  getBudget(request: BudgetGetRequestDTO): Promise<BudgetGetResponseDTO>;
  getBudgetByYearAndType(
    request: BudgetGetByYearAndTypeRequestDTO,
  ): Promise<BudgetGetByYearAndTypeResponseDTO>;
  deleteBudget(request: BudgetDeleteRequestDTO): Promise<BudgetDeleteResponseDTO>;
  updateBudget(request: BudgetUpdateRequestDTO): Promise<BudgetUpdateResponseDTO>;
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

  async getBudgetByYearAndType(
    request: BudgetGetByYearAndTypeRequestDTO,
  ): Promise<BudgetGetByYearAndTypeResponseDTO> {
    return await httpClient.get(`/api/budgets/${request.fiscalYear}?type=${request.type}`);
  }

  async deleteBudget(request: BudgetDeleteRequestDTO): Promise<BudgetDeleteResponseDTO> {
    return await httpClient.delete(`/api/budgets/${request.budgetYear}`);
  }

  async updateBudget(request: BudgetUpdateRequestDTO): Promise<BudgetUpdateResponseDTO> {
    return await httpClient.put(`/api/budgets/${request.budgetYear}`, request);
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
