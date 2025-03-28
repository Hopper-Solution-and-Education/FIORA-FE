// src/features/setting/module/partner/data/dto/response/GetPartnerAPIResponseDTO.ts
import { Partner } from '../../../domain/entities/Partner';

export interface GetPartnerAPIResponseDTO {
  code: number;
  message: string;
  data: {
    items: Partner[];
    total: number;
    page: number;
    pageSize: number;
  };
}
