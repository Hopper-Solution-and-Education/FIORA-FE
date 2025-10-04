import { Response } from '@/shared/types';
import { GetPartnerAPIRequestDTO } from '../../data/dto/request/GetPartnerAPIRequestDTO';
import { IPartnerRepository } from '../../data/repositories/PartnerRepository';
import { PartnerResponse } from '../../slices/types';

export interface IGetPartnerUseCase {
  execute(data: GetPartnerAPIRequestDTO): Promise<Response<PartnerResponse>>;
}

export const createGetPartnerUseCase = (repository: IPartnerRepository): IGetPartnerUseCase => ({
  async execute(data: GetPartnerAPIRequestDTO): Promise<Response<PartnerResponse>> {
    return repository.getPartners(data);
  },
});
