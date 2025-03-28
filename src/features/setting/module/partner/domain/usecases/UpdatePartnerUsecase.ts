// src/features/setting/module/partner/domain/usecases/UpdatePartnerUsecase.ts
import { IPartnerRepository } from '../../data/repositories/PartnerRepository';
import { Partner } from '../entities/Partner';
import { UpdatePartnerAPIRequestDTO } from '../../data/dto/request/UpdatePartnerAPIRequestDTO';

export interface IUpdatePartnerUseCase {
  execute(data: UpdatePartnerAPIRequestDTO): Promise<Partner>;
}

export const createUpdatePartnerUseCase = (
  repository: IPartnerRepository,
): IUpdatePartnerUseCase => ({
  async execute(data: UpdatePartnerAPIRequestDTO): Promise<Partner> {
    return repository.updatePartner(data);
  },
});
