import { GetFinanceByDateRequest, GetFinanceByDateResponse } from '../../domain/entities';
import { GetFinanceByDateRequestDTO, GetFinanceByDateResponseDTO } from '../dto';

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
}

export { FinanceMapper };
