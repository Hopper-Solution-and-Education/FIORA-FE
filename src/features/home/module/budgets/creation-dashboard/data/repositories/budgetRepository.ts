import { decorate, injectable } from 'inversify';
import {
  BudgetCreateRequest,
  BudgetCreateResponse,
  BudgetGetByIdRequest,
  BudgetGetByIdResponse,
  BudgetGetRequest,
  BudgetGetResponse,
} from '../../domain/entities/Budget';
import { IBudgetAPI } from '../api/budgetApi';
import BudgetMapper from '../mappers/BudgetMapper';

export interface IBudgetRepository {
  createBudget(request: BudgetCreateRequest): Promise<BudgetCreateResponse>;
  getBudget(request: BudgetGetRequest): Promise<BudgetGetResponse>;
  getBudgetById(request: BudgetGetByIdRequest): Promise<BudgetGetByIdResponse>;
}

export class BudgetRepository implements IBudgetRepository {
  private budgetAPI: IBudgetAPI;

  constructor(budgetAPI: IBudgetAPI) {
    this.budgetAPI = budgetAPI;
  }

  async createBudget(request: BudgetCreateRequest): Promise<BudgetCreateResponse> {
    const requestAPI = BudgetMapper.toCreateBudgetRequestDTO(request);
    const response = await this.budgetAPI.createBudget(requestAPI);
    return BudgetMapper.toCreateBudgetResponse(response);
  }

  async getBudget(request: BudgetGetRequest): Promise<BudgetGetResponse> {
    const requestAPI = BudgetMapper.toGetBudgetRequestDTO(request);
    const response = await this.budgetAPI.getBudget(requestAPI);
    return BudgetMapper.toGetBudgetResponse(response);
  }

  async getBudgetById(request: BudgetGetByIdRequest): Promise<BudgetGetByIdResponse> {
    const requestAPI = BudgetMapper.toGetBudgetByIdRequestDTO(request);
    const response = await this.budgetAPI.getBudgetById(requestAPI);
    return BudgetMapper.toGetBudgetByIdResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), BudgetRepository);

// Create a factory function
export const createBudgetRepository = (budgetAPI: IBudgetAPI): IBudgetRepository => {
  return new BudgetRepository(budgetAPI);
};
