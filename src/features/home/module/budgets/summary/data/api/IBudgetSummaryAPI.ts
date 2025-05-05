import { BudgetType } from '@prisma/client';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import { BudgetSummaryResponseDTO } from '../dto/response/BudgetSummaryResponseDTO';
import { BudgetByTypeResponseDTO } from '../dto/response/BudgetSummaryResponseDTO';

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
