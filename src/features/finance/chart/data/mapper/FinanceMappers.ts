import {
  GetFinanceByCategoryRequest,
  GetFinanceByCategoryResponse,
  GetFinanceByDateRequest,
  GetFinanceByDateResponse,
  GetFinanceWithFilterRequest,
  GetFinanceWithFilterResponse,
} from '../../domain/entities';
import {
  GetFinanceByCategoryRequestDTO,
  GetFinanceByCategoryResponseDTO,
  GetFinanceByDateRequestDTO,
  GetFinanceByDateResponseDTO,
  GetFinanceWithFilterRequestDTO,
  GetFinanceWithFilterResponseDTO,
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

  static toGetFinanceWithFilterRequest(
    request: GetFinanceWithFilterRequest,
  ): GetFinanceWithFilterRequestDTO {
    return {
      type: request.type,
      ids: request.ids,
    };
  }

  static toGetFinanceWithFilterResponse(
    response: GetFinanceWithFilterResponseDTO,
  ): GetFinanceWithFilterResponse {
    return response;
  }
}

export { FinanceMapper };
