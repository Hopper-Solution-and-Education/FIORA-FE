import { BudgetDto } from '../../data/dto';
import { BudgetType } from '../enum/BudgetType';

export class Budget {
  public id: string | undefined;
  public userId: string | undefined;
  public fiscalYear: string | undefined;
  public type: BudgetType | undefined;
  public totalExp?: number | undefined;
  public totalInc?: number | undefined;
  public h1Exp?: number | undefined;
  public h1Inc?: number | undefined;
  public h2Exp?: number | undefined;
  public h2Inc?: number | undefined;
  public q1Exp?: number | undefined;
  public q1Inc?: number | undefined;
  public q2Exp?: number | undefined;
  public q2Inc?: number | undefined;
  public q3Exp?: number | undefined;
  public q3Inc?: number | undefined;
  public q4Exp?: number | undefined;
  public q4Inc?: number | undefined;
  public m1Exp?: number | undefined;
  public m1Inc?: number | undefined;
  public m2Exp?: number | undefined;
  public m2Inc?: number | undefined;
  public m3Exp?: number | undefined;
  public m3Inc?: number | undefined;
  public m4Exp?: number | undefined;
  public m4Inc?: number | undefined;
  public m5Exp?: number | undefined;
  public m5Inc?: number | undefined;
  public m6Exp?: number | undefined;
  public m6Inc?: number | undefined;
  public m7Exp?: number | undefined;
  public m7Inc?: number | undefined;
  public m8Exp?: number | undefined;
  public m8Inc?: number | undefined;
  public m9Exp?: number | undefined;
  public m9Inc?: number | undefined;
  public m10Exp?: number | undefined;
  public m10Inc?: number | undefined;
  public m11Exp?: number | undefined;
  public m11Inc?: number | undefined;
  public m12Exp?: number | undefined;
  public m12Inc?: number | undefined;
  public createdAt: string | undefined;
  public createdBy?: string | undefined;
  public updatedAt: string | undefined;
  public updatedBy?: string | undefined;

  public constructor(builder: BudgetBuilder) {
    this.id = builder.id;
    this.userId = builder.userId;
    this.fiscalYear = builder.fiscalYear;
    this.type = builder.type;
    this.totalExp = builder.totalExp;
    this.totalInc = builder.totalInc;
    this.h1Exp = builder.h1Exp;
    this.h1Inc = builder.h1Inc;
    this.h2Exp = builder.h2Exp;
    this.h2Inc = builder.h2Inc;
    this.q1Exp = builder.q1Exp;
    this.q1Inc = builder.q1Inc;
    this.q2Exp = builder.q2Exp;
    this.q2Inc = builder.q2Inc;
    this.q3Exp = builder.q3Exp;
    this.q3Inc = builder.q3Inc;
    this.q4Exp = builder.q4Exp;
    this.q4Inc = builder.q4Inc;
    this.m1Exp = builder.m1Exp;
    this.m1Inc = builder.m1Inc;
    this.m2Exp = builder.m2Exp;
    this.m2Inc = builder.m2Inc;
    this.m3Exp = builder.m3Exp;
    this.m3Inc = builder.m3Inc;
    this.m4Exp = builder.m4Exp;
    this.m4Inc = builder.m4Inc;
    this.m5Exp = builder.m5Exp;
    this.m5Inc = builder.m5Inc;
    this.m6Exp = builder.m6Exp;
    this.m6Inc = builder.m6Inc;
    this.m7Exp = builder.m7Exp;
    this.m7Inc = builder.m7Inc;
    this.m8Exp = builder.m8Exp;
    this.m8Inc = builder.m8Inc;
    this.m9Exp = builder.m9Exp;
    this.m9Inc = builder.m9Inc;
    this.m10Exp = builder.m10Exp;
    this.m10Inc = builder.m10Inc;
    this.m11Exp = builder.m11Exp;
    this.m11Inc = builder.m11Inc;
    this.m12Exp = builder.m12Exp;
    this.m12Inc = builder.m12Inc;
    this.createdAt = builder.createdAt;
    this.createdBy = builder.createdBy;
    this.updatedAt = builder.updatedAt;
    this.updatedBy = builder.updatedBy;
  }

  public static fromDto(dto: BudgetDto): Budget {
    return Budget.builder()
      .setId(dto.id)
      .setUserId(dto.user_id)
      .setFiscalYear(dto.fiscal_year)
      .setType(dto.type)
      .setTotalExp(dto.total_exp)
      .setTotalInc(dto.total_inc)
      .setH1Exp(dto.h1_exp)
      .setH1Inc(dto.h1_inc)
      .setH2Exp(dto.h2_exp)
      .setH2Inc(dto.h2_inc)
      .setQ1Exp(dto.q1_exp)
      .setQ1Inc(dto.q1_inc)
      .setQ2Exp(dto.q2_exp)
      .setQ2Inc(dto.q2_inc)
      .setQ3Exp(dto.q3_exp)
      .setQ3Inc(dto.q3_inc)
      .setQ4Exp(dto.q4_exp)
      .setQ4Inc(dto.q4_inc)
      .setM1Exp(dto.m1_exp)
      .setM1Inc(dto.m1_inc)
      .setM2Exp(dto.m2_exp)
      .setM2Inc(dto.m2_inc)
      .setM3Exp(dto.m3_exp)
      .setM3Inc(dto.m3_inc)
      .setM4Exp(dto.m4_exp)
      .setM4Inc(dto.m4_inc)
      .setM5Exp(dto.m5_exp)
      .setM5Inc(dto.m5_inc)
      .setM6Exp(dto.m6_exp)
      .setM6Inc(dto.m6_inc)
      .setM7Exp(dto.m7_exp)
      .setM7Inc(dto.m7_inc)
      .setM8Exp(dto.m8_exp)
      .setM8Inc(dto.m8_inc)
      .setM9Exp(dto.m9_exp)
      .setM9Inc(dto.m9_inc)
      .setM10Exp(dto.m10_exp)
      .setM10Inc(dto.m10_inc)
      .setM11Exp(dto.m11_exp)
      .setM11Inc(dto.m11_inc)
      .setM12Exp(dto.m12_exp)
      .setM12Inc(dto.m12_inc)
      .setCreatedAt(dto.created_at)
      .setCreatedBy(dto.created_by)
      .setUpdatedAt(dto.updated_at)
      .setUpdatedBy(dto.updated_by)
      .build();
  }

  public static builder(): BudgetBuilder {
    return new BudgetBuilder();
  }
}

export class BudgetBuilder {
  public id?: string;
  public userId?: string;
  public fiscalYear?: string;
  public type?: BudgetType;
  public totalExp?: number;
  public totalInc?: number;
  public h1Exp?: number;
  public h1Inc?: number;
  public h2Exp?: number;
  public h2Inc?: number;
  public q1Exp?: number;
  public q1Inc?: number;
  public q2Exp?: number;
  public q2Inc?: number;
  public q3Exp?: number;
  public q3Inc?: number;
  public q4Exp?: number;
  public q4Inc?: number;
  public m1Exp?: number;
  public m1Inc?: number;
  public m2Exp?: number;
  public m2Inc?: number;
  public m3Exp?: number;
  public m3Inc?: number;
  public m4Exp?: number;
  public m4Inc?: number;
  public m5Exp?: number;
  public m5Inc?: number;
  public m6Exp?: number;
  public m6Inc?: number;
  public m7Exp?: number;
  public m7Inc?: number;
  public m8Exp?: number;
  public m8Inc?: number;
  public m9Exp?: number;
  public m9Inc?: number;
  public m10Exp?: number;
  public m10Inc?: number;
  public m11Exp?: number;
  public m11Inc?: number;
  public m12Exp?: number;
  public m12Inc?: number;
  public createdAt?: string;
  public createdBy?: string;
  public updatedAt?: string;
  public updatedBy?: string;

  public setId(id: string | undefined): BudgetBuilder {
    this.id = id;
    return this;
  }

  public setUserId(userId: string | undefined): BudgetBuilder {
    this.userId = userId;
    return this;
  }

  public setFiscalYear(fiscalYear: string | undefined): BudgetBuilder {
    this.fiscalYear = fiscalYear;
    return this;
  }

  public setType(type: BudgetType | undefined): BudgetBuilder {
    this.type = type;
    return this;
  }

  public setTotalExp(totalExp: number | undefined): BudgetBuilder {
    this.totalExp = totalExp;
    return this;
  }

  public setTotalInc(totalInc: number | undefined): BudgetBuilder {
    this.totalInc = totalInc;
    return this;
  }

  public setH1Exp(h1Exp: number | undefined): BudgetBuilder {
    this.h1Exp = h1Exp;
    return this;
  }

  public setH1Inc(h1Inc: number | undefined): BudgetBuilder {
    this.h1Inc = h1Inc;
    return this;
  }

  public setH2Exp(h2Exp: number | undefined): BudgetBuilder {
    this.h2Exp = h2Exp;
    return this;
  }

  public setH2Inc(h2Inc: number | undefined): BudgetBuilder {
    this.h2Inc = h2Inc;
    return this;
  }

  public setQ1Exp(q1Exp: number | undefined): BudgetBuilder {
    this.q1Exp = q1Exp;
    return this;
  }

  public setQ1Inc(q1Inc: number | undefined): BudgetBuilder {
    this.q1Inc = q1Inc;
    return this;
  }

  public setQ2Exp(q2Exp: number | undefined): BudgetBuilder {
    this.q2Exp = q2Exp;
    return this;
  }

  public setQ2Inc(q2Inc: number | undefined): BudgetBuilder {
    this.q2Inc = q2Inc;
    return this;
  }

  public setQ3Exp(q3Exp: number | undefined): BudgetBuilder {
    this.q3Exp = q3Exp;
    return this;
  }

  public setQ3Inc(q3Inc: number | undefined): BudgetBuilder {
    this.q3Inc = q3Inc;
    return this;
  }

  public setQ4Exp(q4Exp: number | undefined): BudgetBuilder {
    this.q4Exp = q4Exp;
    return this;
  }

  public setQ4Inc(q4Inc: number | undefined): BudgetBuilder {
    this.q4Inc = q4Inc;
    return this;
  }

  public setM1Exp(m1Exp: number | undefined): BudgetBuilder {
    this.m1Exp = m1Exp;
    return this;
  }

  public setM1Inc(m1Inc: number | undefined): BudgetBuilder {
    this.m1Inc = m1Inc;
    return this;
  }

  public setM2Exp(m2Exp: number | undefined): BudgetBuilder {
    this.m2Exp = m2Exp;
    return this;
  }

  public setM2Inc(m2Inc: number | undefined): BudgetBuilder {
    this.m2Inc = m2Inc;
    return this;
  }

  public setM3Exp(m3Exp: number | undefined): BudgetBuilder {
    this.m3Exp = m3Exp;
    return this;
  }

  public setM3Inc(m3Inc: number | undefined): BudgetBuilder {
    this.m3Inc = m3Inc;
    return this;
  }

  public setM4Exp(m4Exp: number | undefined): BudgetBuilder {
    this.m4Exp = m4Exp;
    return this;
  }

  public setM4Inc(m4Inc: number | undefined): BudgetBuilder {
    this.m4Inc = m4Inc;
    return this;
  }

  public setM5Exp(m5Exp: number | undefined): BudgetBuilder {
    this.m5Exp = m5Exp;
    return this;
  }

  public setM5Inc(m5Inc: number | undefined): BudgetBuilder {
    this.m5Inc = m5Inc;
    return this;
  }

  public setM6Exp(m6Exp: number | undefined): BudgetBuilder {
    this.m6Exp = m6Exp;
    return this;
  }

  public setM6Inc(m6Inc: number | undefined): BudgetBuilder {
    this.m6Inc = m6Inc;
    return this;
  }

  public setM7Exp(m7Exp: number | undefined): BudgetBuilder {
    this.m7Exp = m7Exp;
    return this;
  }

  public setM7Inc(m7Inc: number | undefined): BudgetBuilder {
    this.m7Inc = m7Inc;
    return this;
  }

  public setM8Exp(m8Exp: number | undefined): BudgetBuilder {
    this.m8Exp = m8Exp;
    return this;
  }

  public setM8Inc(m8Inc: number | undefined): BudgetBuilder {
    this.m8Inc = m8Inc;
    return this;
  }

  public setM9Exp(m9Exp: number | undefined): BudgetBuilder {
    this.m9Exp = m9Exp;
    return this;
  }

  public setM9Inc(m9Inc: number | undefined): BudgetBuilder {
    this.m9Inc = m9Inc;
    return this;
  }

  public setM10Exp(m10Exp: number | undefined): BudgetBuilder {
    this.m10Exp = m10Exp;
    return this;
  }

  public setM10Inc(m10Inc: number | undefined): BudgetBuilder {
    this.m10Inc = m10Inc;
    return this;
  }

  public setM11Exp(m11Exp: number | undefined): BudgetBuilder {
    this.m11Exp = m11Exp;
    return this;
  }

  public setM11Inc(m11Inc: number | undefined): BudgetBuilder {
    this.m11Inc = m11Inc;
    return this;
  }

  public setM12Exp(m12Exp: number | undefined): BudgetBuilder {
    this.m12Exp = m12Exp;
    return this;
  }

  public setM12Inc(m12Inc: number | undefined): BudgetBuilder {
    this.m12Inc = m12Inc;
    return this;
  }

  public setCreatedAt(createdAt: string | undefined): BudgetBuilder {
    this.createdAt = createdAt;
    return this;
  }

  public setCreatedBy(createdBy: string | undefined): BudgetBuilder {
    this.createdBy = createdBy;
    return this;
  }

  public setUpdatedAt(updatedAt: string | undefined): BudgetBuilder {
    this.updatedAt = updatedAt;
    return this;
  }

  public setUpdatedBy(updatedBy: string | undefined): BudgetBuilder {
    this.updatedBy = updatedBy;
    return this;
  }

  public build(): Budget {
    if (
      !this.id ||
      !this.userId ||
      !this.fiscalYear ||
      !this.type ||
      !this.createdAt ||
      !this.updatedAt
    ) {
      throw new Error(
        'Mandatory fields (id, userId, fiscalYear, type, createdAt, updatedAt) must be set',
      );
    }
    return new Budget(this);
  }
}
