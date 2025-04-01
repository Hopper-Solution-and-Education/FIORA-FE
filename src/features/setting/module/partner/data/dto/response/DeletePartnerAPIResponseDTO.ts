import { Partner } from '../../../domain/entities/Partner';

export interface DeletePartnerAPIResponseDTO {
  code: number;
  message: string;
  data: Partner;
}
