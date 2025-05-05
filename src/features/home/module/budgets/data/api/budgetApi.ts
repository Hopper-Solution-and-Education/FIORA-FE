import { httpClient } from '@/config/http-client/HttpClient';
import { Currency } from '@prisma/client';
import { decorate, injectable } from 'inversify';
import isEmpty from 'lodash/isEmpty';
import { BudgetCreateRequestDTO } from '../dto/request';
import { BudgetGetRequestDTO } from '../dto/request/BudgetGetRequestDTO';
import { BudgetCreateResponseDTO } from '../dto/response';
import { BudgetGetResponseDTO } from '../dto/response/BudgetGetResponseDTO';

interface IBudgetAPI {
  createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO>;
  getBudget(request: BudgetGetRequestDTO): Promise<BudgetGetResponseDTO>;
}

class BudgetAPI implements IBudgetAPI {
  async createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO> {
    return await httpClient.post(`/api/budgets`, request);
  }

  // async getBudget(request: BudgetGetRequestDTO): Promise<BudgetGetResponseDTO> {
  //   return await httpClient.get(
  //     `/api/budgets?${request.cursor ? `cursor=${request?.cursor}` : ''}&take=${request.take}&search=${request.search}`,
  //   );
  // }

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
        'x-user-currency': request.currency ?? Currency.VND,
      },
    );
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
