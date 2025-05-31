// src/features/setting/module/partner/data/dto/response/UpdatePartnerAPIResponseDTO.ts
import { Partner } from '../../../domain/entities/Partner';

export interface UpdatePartnerAPIResponseDTO {
  status: number;
  code: number;
  message: string;
  data: Partner;
}
