import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { BudgetCreateRequestDTO } from '../dto/request';
import { BudgetCreateResponseDTO } from '../dto/response';

interface IBudgetAPI {
  createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO>;
}

class BudgetAPI implements IBudgetAPI {
  async createBudget(request: BudgetCreateRequestDTO): Promise<BudgetCreateResponseDTO> {
    return await httpClient.post(`/api/budgets`, request);
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
