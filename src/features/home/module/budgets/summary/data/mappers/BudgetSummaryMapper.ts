import {
  BudgetByTypeResponseDTO,
  BudgetSummaryResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import { BudgetSummary, BudgetSummaryByType } from '../../domain/entities/BudgetSummary';
import { Budget } from '../../domain/entities/Budget';

class BudgetSummaryMapper {
  static toBudgetSummary(apiResponse: BudgetSummaryResponseDTO): BudgetSummary {
    const { topBudget, botBudget, actBudget, allBudgets } = apiResponse.data;

    return {
      topBudget: topBudget ? this.mapBudgetFromDto(topBudget) : null,
      botBudget: botBudget ? this.mapBudgetFromDto(botBudget) : null,
      actBudget: actBudget ? this.mapBudgetFromDto(actBudget) : null,
      allBudgets: allBudgets.map((budget) => this.mapBudgetFromDto(budget)),
    };
  }

  static toBudgetByType(apiResponse: BudgetByTypeResponseDTO): BudgetSummaryByType {
    return this.mapBudgetFromDto(apiResponse.data);
  }

  private static mapBudgetFromDto(dto: any): Budget {
    return Budget.builder()
      .setId(dto.id)
      .setUserId(dto.userId || dto.user_id)
      .setFiscalYear(dto.fiscalYear || dto.fiscal_year)
      .setType(dto.type)
      .setTotalExp(dto.totalExp || dto.total_exp)
      .setTotalInc(dto.totalInc || dto.total_inc)
      .setH1Exp(dto.h1Exp || dto.h1_exp)
      .setH1Inc(dto.h1Inc || dto.h1_inc)
      .setH2Exp(dto.h2Exp || dto.h2_exp)
      .setH2Inc(dto.h2Inc || dto.h2_inc)
      .setQ1Exp(dto.q1Exp || dto.q1_exp)
      .setQ1Inc(dto.q1Inc || dto.q1_inc)
      .setQ2Exp(dto.q2Exp || dto.q2_exp)
      .setQ2Inc(dto.q2Inc || dto.q2_inc)
      .setQ3Exp(dto.q3Exp || dto.q3_exp)
      .setQ3Inc(dto.q3Inc || dto.q3_inc)
      .setQ4Exp(dto.q4Exp || dto.q4_exp)
      .setQ4Inc(dto.q4Inc || dto.q4_inc)
      .setM1Exp(dto.m1Exp || dto.m1_exp)
      .setM1Inc(dto.m1Inc || dto.m1_inc)
      .setM2Exp(dto.m2Exp || dto.m2_exp)
      .setM2Inc(dto.m2Inc || dto.m2_inc)
      .setM3Exp(dto.m3Exp || dto.m3_exp)
      .setM3Inc(dto.m3Inc || dto.m3_inc)
      .setM4Exp(dto.m4Exp || dto.m4_exp)
      .setM4Inc(dto.m4Inc || dto.m4_inc)
      .setM5Exp(dto.m5Exp || dto.m5_exp)
      .setM5Inc(dto.m5Inc || dto.m5_inc)
      .setM6Exp(dto.m6Exp || dto.m6_exp)
      .setM6Inc(dto.m6Inc || dto.m6_inc)
      .setM7Exp(dto.m7Exp || dto.m7_exp)
      .setM7Inc(dto.m7Inc || dto.m7_inc)
      .setM8Exp(dto.m8Exp || dto.m8_exp)
      .setM8Inc(dto.m8Inc || dto.m8_inc)
      .setM9Exp(dto.m9Exp || dto.m9_exp)
      .setM9Inc(dto.m9Inc || dto.m9_inc)
      .setM10Exp(dto.m10Exp || dto.m10_exp)
      .setM10Inc(dto.m10Inc || dto.m10_inc)
      .setM11Exp(dto.m11Exp || dto.m11_exp)
      .setM11Inc(dto.m11Inc || dto.m11_inc)
      .setM12Exp(dto.m12Exp || dto.m12_exp)
      .setM12Inc(dto.m12Inc || dto.m12_inc)
      .setCreatedAt(dto.createdAt || dto.created_at)
      .setCreatedBy(dto.createdBy || dto.created_by)
      .setUpdatedAt(dto.updatedAt || dto.updated_at)
      .setUpdatedBy(dto.updatedBy || dto.updated_by)
      .build();
  }
}

export default BudgetSummaryMapper;
