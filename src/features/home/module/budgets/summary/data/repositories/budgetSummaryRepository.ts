import { BudgetType } from '@prisma/client';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  BudgetByTypeResponseDTO,
  BudgetSummaryResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import { BudgetSummary, BudgetSummaryByType } from '../../domain/entities/BudgetSummary';
import BudgetSummaryMapper from '../mappers/BudgetSummaryMapper';
import budgetSummaryApi, { IBudgetSummaryAPI } from '../api/budgetSummaryApi';

export interface IBudgetSummaryRepository {
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummary>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType>;
}

class BudgetSummaryRepository implements IBudgetSummaryRepository {
  private budgetSummaryAPI: IBudgetSummaryAPI;

  constructor(budgetSummaryAPI: IBudgetSummaryAPI) {
    this.budgetSummaryAPI = budgetSummaryAPI;
  }

  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummary> {
    try {
      const data: BudgetSummaryResponseDTO = await this.budgetSummaryAPI.getBudgetSummary(params);
      return BudgetSummaryMapper.toBudgetSummary(data);
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType> {
    try {
      const data: BudgetByTypeResponseDTO = await this.budgetSummaryAPI.getBudgetByType(
        fiscalYear,
        type,
      );
      return BudgetSummaryMapper.toBudgetByType(data);
    } catch (error) {
      console.error(`Error fetching budget by type ${type}:`, error);
      throw error;
    }
  }
}

export default new BudgetSummaryRepository(budgetSummaryApi);
