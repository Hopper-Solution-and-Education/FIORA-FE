// src/features/setting/module/partner/data/dto/response/CreatePartnerAPIResponseDTO.ts
import { Partner } from '../../../domain/entities/Partner';
import { ApiResponse } from '..';

export type CreatePartnerAPIResponseDTO = ApiResponse<Partner>;
