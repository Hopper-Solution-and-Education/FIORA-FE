import { decorate, injectable } from 'inversify';
import {
  BudgetCreateRequest,
  BudgetCreateResponse,
  BudgetDeleteRequest,
  BudgetDeleteResponse,
  BudgetGetByIdRequest,
  BudgetGetByIdResponse,
  BudgetGetRequest,
  BudgetGetResponse,
  BudgetUpdateRequest,
  BudgetUpdateResponse,
} from '../../domain/entities/Budget';
import { IBudgetAPI } from '../api/budgetApi';
import BudgetMapper from '../mappers/BudgetMapper';

export interface IBudgetRepository {
  createBudget(request: BudgetCreateRequest): Promise<BudgetCreateResponse>;
  getBudget(request: BudgetGetRequest): Promise<BudgetGetResponse>;
  getBudgetById(request: BudgetGetByIdRequest): Promise<BudgetGetByIdResponse>;
  deleteBudget(request: BudgetDeleteRequest): Promise<BudgetDeleteResponse>;
  updateBudget(request: BudgetUpdateRequest): Promise<BudgetUpdateResponse>;
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

  async deleteBudget(request: BudgetDeleteRequest): Promise<BudgetDeleteResponse> {
    const requestAPI = BudgetMapper.toDeleteBudgetRequestDTO(request);
    const response = await this.budgetAPI.deleteBudget(requestAPI);
    return BudgetMapper.toDeleteBudgetResponse(response);
  }

  async updateBudget(request: BudgetUpdateRequest): Promise<BudgetUpdateResponse> {
    const requestAPI = BudgetMapper.toUpdateBudgetRequestDTO(request);
    const response = await this.budgetAPI.updateBudget(requestAPI);
    return BudgetMapper.toUpdateBudgetResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), BudgetRepository);

// Create a factory function
export const createBudgetRepository = (budgetAPI: IBudgetAPI): IBudgetRepository => {
  return new BudgetRepository(budgetAPI);
};
