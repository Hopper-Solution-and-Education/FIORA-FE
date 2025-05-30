// src/features/setting/module/partner/data/dto/response/GetPartnerAPIResponseDTO.ts
import { Partner } from '../../../domain/entities/Partner';

export interface GetPartnerAPIResponseDTO {
  status: number;
  message: string;
  data: {
    data: Partner[];
    minIncome: number;
    maxIncome: number;
    minExpense: number;
    maxExpense: number;
  };
}
