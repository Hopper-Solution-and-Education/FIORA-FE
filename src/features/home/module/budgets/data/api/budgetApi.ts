import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
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

  async getBudget(request: BudgetGetRequestDTO): Promise<BudgetGetResponseDTO> {
    return await httpClient.get(
      `/api/budgets?${request.cursor ? `cursor=${request?.cursor}` : ''}&take=${request.take}&search=${request.search}`,
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
