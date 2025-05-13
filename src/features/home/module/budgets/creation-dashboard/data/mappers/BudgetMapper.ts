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
import {
  BudgetDeleteRequestDTO,
  BudgetGetByIdRequestDTO,
  BudgetUpdateRequestDTO,
} from '../dto/request';
import { BudgetCreateRequestDTO } from '../dto/request/BudgetCreateRequestDTO';
import { BudgetGetRequestDTO } from '../dto/request/BudgetGetRequestDTO';
import {
  BudgetDeleteResponseDTO,
  BudgetGetByIdResponseDTO,
  BudgetUpdateResponseDTO,
} from '../dto/response';
import { BudgetCreateResponseDTO } from '../dto/response/BudgetCreateResponseDTO';
import { BudgetGetResponseDTO } from '../dto/response/BudgetGetResponseDTO';

class BudgetMapper {
  // Get Category ------------------------------
  static toCreateBudgetRequestDTO(requestDTO: BudgetCreateRequest): BudgetCreateRequestDTO {
    return {
      ...requestDTO,
      fiscalYear: Number(requestDTO.fiscalYear),
    };
  }

  static toCreateBudgetResponse(apiResponse: BudgetCreateResponseDTO): BudgetCreateResponse {
    return {
      id: apiResponse.data.id,
      icon: apiResponse.data.icon,
      fiscalYear: apiResponse.data.fiscalYear,
      type: apiResponse.data.type,
      totalExpense: apiResponse.data.totalExpense,
      totalIncome: apiResponse.data.totalIncome,
      h1Expense: apiResponse.data.h1Expense,
      h1Income: apiResponse.data.h1Income,
      h2Expense: apiResponse.data.h2Expense,
      h2Income: apiResponse.data.h2Income,
      q1Expense: apiResponse.data.q1Expense,
      q1Income: apiResponse.data.q1Income,
      q2Expense: apiResponse.data.q2Expense,
      q2Income: apiResponse.data.q2Income,
      q3Expense: apiResponse.data.q3Expense,
      q3Income: apiResponse.data.q3Income,
      q4Expense: apiResponse.data.q4Expense,
      q4Income: apiResponse.data.q4Income,
      m1Income: apiResponse.data.m1Income,
      m1Expense: apiResponse.data.m1Expense,
      m2Income: apiResponse.data.m2Income,
      m2Expense: apiResponse.data.m2Expense,
      m3Income: apiResponse.data.m3Income,
      m3Expense: apiResponse.data.m3Expense,
      m4Income: apiResponse.data.m4Income,
      m4Expense: apiResponse.data.m4Expense,
      m5Income: apiResponse.data.m5Income,
      m5Expense: apiResponse.data.m5Expense,
      m6Income: apiResponse.data.m6Income,
      m6Expense: apiResponse.data.m6Expense,
      m7Income: apiResponse.data.m7Income,
      m7Expense: apiResponse.data.m7Expense,
      m8Income: apiResponse.data.m8Income,
      m8Expense: apiResponse.data.m8Expense,
      m9Income: apiResponse.data.m9Income,
      m9Expense: apiResponse.data.m9Expense,
      m10Income: apiResponse.data.m10Income,
      m10Expense: apiResponse.data.m10Expense,
      m11Income: apiResponse.data.m11Income,
      m11Expense: apiResponse.data.m11Expense,
      m12Income: apiResponse.data.m12Income,
      m12Expense: apiResponse.data.m12Expense,
    };
  }

  static toGetBudgetRequestDTO(requestDTO: BudgetGetRequest): BudgetGetRequestDTO {
    return {
      cursor: requestDTO.cursor,
      take: requestDTO.take,
      search: requestDTO.search,
      filters: {
        fiscalYear: {
          gte: requestDTO.filters?.fiscalYear?.gte ?? 0,
          lte: requestDTO.filters?.fiscalYear?.lte ?? 9999,
        },
      },
    };
  }

  static toGetBudgetResponse(apiResponse: BudgetGetResponseDTO): BudgetGetResponse {
    return {
      currency: apiResponse.data.currency,
      data: apiResponse.data.data,
      nextCursor: apiResponse.data.nextCursor,
    };
  }

  static toGetBudgetByIdRequestDTO(requestDTO: BudgetGetByIdRequest): BudgetGetByIdRequestDTO {
    return {
      fiscalYear: requestDTO.fiscalYear,
      type: requestDTO.type,
    };
  }

  static toGetBudgetByIdResponse(apiResponse: BudgetGetByIdResponseDTO): BudgetGetByIdResponse {
    return {
      id: apiResponse.data.id,
      icon: apiResponse.data.icon,
      fiscalYear: apiResponse.data.fiscalYear,
      estimatedTotalExpense: apiResponse.data.estimatedTotalExpense,
      estimatedTotalIncome: apiResponse.data.estimatedTotalIncome,
      description: apiResponse.data.description,
      currency: apiResponse.data.currency,
    };
  }

  static toDeleteBudgetRequestDTO(requestDTO: BudgetDeleteRequest): BudgetDeleteRequestDTO {
    return {
      budgetId: requestDTO.budgetId,
    };
  }

  static toDeleteBudgetResponse(apiResponse: BudgetDeleteResponseDTO): BudgetDeleteResponse {
    return {
      message: apiResponse.message,
    };
  }

  static toUpdateBudgetRequestDTO(requestDTO: BudgetUpdateRequest): BudgetUpdateRequestDTO {
    return {
      budgetYear: requestDTO.budgetYear,
      icon: requestDTO.icon,
      fiscalYear: requestDTO.fiscalYear,
      estimatedTotalExpense: requestDTO.estimatedTotalExpense,
      estimatedTotalIncome: requestDTO.estimatedTotalIncome,
      description: requestDTO.description,
      currency: requestDTO.currency,
      type: requestDTO.type,
    };
  }

  static toUpdateBudgetResponse(apiResponse: BudgetUpdateResponseDTO): BudgetUpdateResponse {
    return {
      icon: apiResponse.data.icon,
      fiscalYear: apiResponse.data.fiscalYear,
      estimatedTotalExpense: apiResponse.data.estimatedTotalExpense,
      estimatedTotalIncome: apiResponse.data.estimatedTotalIncome,
      description: apiResponse.data.description,
      currency: apiResponse.data.currency,
      type: apiResponse.data.type,
    };
  }
}

export default BudgetMapper;
