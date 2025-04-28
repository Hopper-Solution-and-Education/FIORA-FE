import { BudgetType } from '@prisma/client';
import { injectable } from 'inversify';
import { IBudgetSummaryAPI } from './IBudgetSummaryAPI';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import { BudgetSummaryResponseDTO } from '../dto/response/BudgetSummaryResponseDTO';
import { BudgetByTypeResponseDTO } from '../dto/response/BudgetSummaryResponseDTO';
import { httpClient } from '@/config/http-client/HttpClient';

@injectable()
export class BudgetSummaryAPI implements IBudgetSummaryAPI {
  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    try {
      return await httpClient.get<BudgetSummaryResponseDTO>(
        `/api/budgets/summary?fiscalYear=${params.fiscalYear}`,
      );
    } catch (error) {
      console.error('Error in BudgetSummaryAPI.getBudgetSummary:', error);
      throw error;
    }
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetByTypeResponseDTO> {
    try {
      return await httpClient.get<BudgetByTypeResponseDTO>(
        `/api/budgets/summary?fiscalYear=${fiscalYear}&type=${type}`,
      );
    } catch (error) {
      console.error(`Error in BudgetSummaryAPI.getBudgetByType for type ${type}:`, error);
      throw error;
    }
  }
}
export default new BudgetSummaryAPI();
