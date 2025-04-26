import { BudgetType } from '@prisma/client';
import { httpClient } from '@/config/http-client/HttpClient';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  BudgetByTypeResponseDTO,
  BudgetSummaryResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import { decorate, injectable } from 'inversify';

export interface IBudgetSummaryAPI {
  /**
   * Lấy tổng quan ngân sách theo năm tài chính
   * @param params Tham số yêu cầu
   * @returns Promise chứa dữ liệu phản hồi
   */
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO>;

  /**
   * Lấy ngân sách theo loại và năm tài chính
   * @param fiscalYear Năm tài chính
   * @param type Loại ngân sách
   * @returns Promise chứa dữ liệu phản hồi
   */
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetByTypeResponseDTO>;
}

class BudgetSummaryAPI implements IBudgetSummaryAPI {
  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    return await httpClient.get<BudgetSummaryResponseDTO>(
      `/api/budgets/summary/id?fiscalYear=${params.fiscalYear}`,
    );
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetByTypeResponseDTO> {
    return await httpClient.get<BudgetByTypeResponseDTO>(
      `/api/budgets/summary/id?fiscalYear=${fiscalYear}&type=${type}`,
    );
  }
}

// Áp dụng decorator theo cách lập trình
decorate(injectable(), BudgetSummaryAPI);

// Tạo hàm factory
export const createBudgetSummaryAPI = (): IBudgetSummaryAPI => {
  return new BudgetSummaryAPI();
};

export { BudgetSummaryAPI };
export default new BudgetSummaryAPI();
