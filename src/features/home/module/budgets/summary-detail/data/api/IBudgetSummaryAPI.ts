import { BudgetType } from '../../domain/entities/BudgetType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  BudgetSummaryResponseDTO,
  BudgetByTypeResponseDTO,
  BudgetYearsResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryResponseDTO,
  CategoryPlanningResponseDTO,
} from '../dto/response/CategoryResponseDTO';
import {
  TopDownUpdateRequestDTO,
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import { Currency, HttpResponse } from '@/shared/types';

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
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetByTypeResponseDTO>;

  /**
   * Lấy danh sách categories theo loại
   * @param type Loại category (Income/Expense)
   * @returns Promise chứa dữ liệu phản hồi
   */
  getCategoriesByType(type: 'Income' | 'Expense', year: number): Promise<CategoryResponseDTO>;

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

  /**
   * Update top-down budget planning
   */
  updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void>;

  /**
   * Update category bottom-up planning
   */
  updateCategoryPlanning(data: CategoryPlanningUpdateRequestDTO, currency: Currency): Promise<void>;

  /**
   * Lấy danh sách năm tài chính đã có ngân sách
   * @returns Promise chứa dữ liệu phản hồi
   */
  getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>>;

  deleteCategory(data: DeleteCategoryRequestDTO): Promise<string>;
}
