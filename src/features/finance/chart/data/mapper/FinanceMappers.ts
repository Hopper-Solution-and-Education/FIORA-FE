import {
  GetFinanceByCategoryRequest,
  GetFinanceByCategoryResponse,
  GetFinanceByDateRequest,
  GetFinanceByDateResponse,
} from '../../domain/entities';
import {
  GetFinanceByCategoryRequestDTO,
  GetFinanceByCategoryResponseDTO,
  GetFinanceByDateRequestDTO,
  GetFinanceByDateResponseDTO,
} from '../dto';

class FinanceMapper {
  static toGetFinanceByDateRequestDTO(
    request: GetFinanceByDateRequest,
  ): GetFinanceByDateRequestDTO {
    return {
      ...request,
    };
  }

  static toGetFinanceByDateResponse(
    response: GetFinanceByDateResponseDTO,
  ): GetFinanceByDateResponse {
    return response.data.map((item) => ({
      period: item.period,
      startDate: item.startDate,
      endDate: item.endDate,
      totalIncome: item.totalIncome,
      totalExpense: item.totalExpense,
    }));
  }

  static toGetFinanceByCategoryResponse(
    response: GetFinanceByCategoryResponseDTO,
  ): GetFinanceByCategoryResponse {
    return response;
  }

  static toGetFinanceByCategoryRequest(
    request: GetFinanceByCategoryRequest,
  ): GetFinanceByCategoryRequestDTO {
    return {
      type: request.type,
      filter: request.filter,
    };
  }
}

export { FinanceMapper };
