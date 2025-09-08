// src/features/setting/module/partner/data/dto/response/CreatePartnerAPIResponseDTO.ts
import { ApiResponse } from '..';
import { Partner } from '../../../domain/entities/Partner';

export type CreatePartnerAPIResponseDTO = ApiResponse<Partner>;
