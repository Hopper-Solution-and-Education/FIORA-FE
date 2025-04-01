import { Partner } from '../../../domain/entities/Partner';

export interface GetPartnerByIdAPIResponseDTO {
  code: number;
  message: string;
  data: Partner;
}
