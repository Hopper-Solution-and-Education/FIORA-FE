import { IPartnerRepository } from '../../data/repositories/PartnerRepository';
import { GetPartnerAPIRequestDTO } from '../../data/dto/request/GetPartnerAPIRequestDTO';
import { Response } from '@/shared/types/Common.types';
import { PartnerResponse } from '../../slices/types';

export interface IGetPartnerUseCase {
  execute(data: GetPartnerAPIRequestDTO): Promise<Response<PartnerResponse>>;
}

export const createGetPartnerUseCase = (repository: IPartnerRepository): IGetPartnerUseCase => ({
  async execute(data: GetPartnerAPIRequestDTO): Promise<Response<PartnerResponse>> {
    return repository.getPartners(data);
  },
});
