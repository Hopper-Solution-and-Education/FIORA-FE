import { BudgetSummary } from '../../domain/entities/BudgetSummary';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetSummaryResponseDTO } from '../dto/response/BudgetSummaryResponseDTO';
import {
  BudgetByTypeResponseDTO,
  BudgetYearsResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import { BudgetType } from '../../domain/entities/BudgetType';
import { HttpResponse } from '@/features/setting/module/product/model';

export class BudgetSummaryMapper {
  static toBudgetSummary(dto: BudgetSummaryResponseDTO): BudgetSummary {
    return {
      topBudget: dto.topBudget,
      botBudget: dto.botBudget,
      actBudget: dto.actBudget,
      allBudgets: dto.allBudgets,
    };
  }

  static toBudgetByType(dto: BudgetByTypeResponseDTO): BudgetSummaryByType {
    return {
      budget: {
        id: dto.data.id || '',
        userId: dto.data.user_id || '',
        fiscalYear: dto.data.fiscal_year || '',
        type: dto.data.type || BudgetType.Top,
        totalExp: dto.data.total_exp || 0,
        totalInc: dto.data.total_inc || 0,
        h1Exp: dto.data.h1_exp || 0,
        h1Inc: dto.data.h1_inc || 0,
        h2Exp: dto.data.h2_exp || 0,
        h2Inc: dto.data.h2_inc || 0,
        q1Exp: dto.data.q1_exp || 0,
        q1Inc: dto.data.q1_inc || 0,
        q2Exp: dto.data.q2_exp || 0,
        q2Inc: dto.data.q2_inc || 0,
        q3Exp: dto.data.q3_exp || 0,
        q3Inc: dto.data.q3_inc || 0,
        q4Exp: dto.data.q4_exp || 0,
        q4Inc: dto.data.q4_inc || 0,
        m1Exp: dto.data.m1_exp || 0,
        m1Inc: dto.data.m1_inc || 0,
        m2Exp: dto.data.m2_exp || 0,
        m2Inc: dto.data.m2_inc || 0,
        m3Exp: dto.data.m3_exp || 0,
        m3Inc: dto.data.m3_inc || 0,
        m4Exp: dto.data.m4_exp || 0,
        m4Inc: dto.data.m4_inc || 0,
        m5Exp: dto.data.m5_exp || 0,
        m5Inc: dto.data.m5_inc || 0,
        m6Exp: dto.data.m6_exp || 0,
        m6Inc: dto.data.m6_inc || 0,
        m7Exp: dto.data.m7_exp || 0,
        m7Inc: dto.data.m7_inc || 0,
        m8Exp: dto.data.m8_exp || 0,
        m8Inc: dto.data.m8_inc || 0,
        m9Exp: dto.data.m9_exp || 0,
        m9Inc: dto.data.m9_inc || 0,
        m10Exp: dto.data.m10_exp || 0,
        m10Inc: dto.data.m10_inc || 0,
        m11Exp: dto.data.m11_exp || 0,
        m11Inc: dto.data.m11_inc || 0,
        m12Exp: dto.data.m12_exp || 0,
        m12Inc: dto.data.m12_inc || 0,
        createdAt: dto.data.created_at || '',
        updatedAt: dto.data.updated_at || '',
        createdBy: dto.data.created_by || '',
        updatedBy: dto.data.updated_by || '',
      },
    };
  }

  static toBudgetYears(dto: HttpResponse<BudgetYearsResponseDTO>): string[] {
    return dto.data;
  }
}
