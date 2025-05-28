import { BudgetType } from '../../domain/entities/BudgetType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  BudgetSummaryResponseDTO,
  BudgetByTypeResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryResponseDTO,
  CategoryPlanningResponseDTO,
} from '../dto/response/CategoryResponseDTO';

export interface IBudgetSummaryAPI {
  /**
   * Lấy tổng quan ngân sách theo năm tài chính
   * @param params Tham số yêu cầu
   * @returns Promise chứa dữ liệu phản hồi
   */
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO>;

  /**
   * Lấy ngân sách theo loại và năm tài chính
   * @param year Năm tài chính
   * @param type Loại ngân sách
   * @returns Promise chứa dữ liệu phản hồi
   */
  getBudgetByType(year: number, type: BudgetType): Promise<BudgetByTypeResponseDTO>;

  /**
   * Lấy danh sách categories theo loại
   * @param type Loại category (Income/Expense)
   * @returns Promise chứa dữ liệu phản hồi
   */
  getCategoriesByType(type: 'Income' | 'Expense'): Promise<CategoryResponseDTO>;

  /**
   * Lấy thông tin actual planning của một category
   * @param categoryId ID của category
   * @param year Năm cần lấy dữ liệu
   * @returns Promise chứa dữ liệu phản hồi
   */
  getActualPlanningByCategory(
    categoryId: string,
    year: number,
  ): Promise<CategoryPlanningResponseDTO>;
}
