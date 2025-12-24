import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { decorate, injectable } from 'inversify';
import { AcknowledgmentFeatureResponse } from '../../data/dto/response';
import { IAcknowledgmentRepository } from '../../repositories/Acknowledgment.repository';

export interface ICreateAcknowledgmentFeatureUseCase {
  execute(featureKey: string, description?: string): Promise<AcknowledgmentFeatureResponse>;
}

export class CreateAcknowledgmentFeatureUseCase implements ICreateAcknowledgmentFeatureUseCase {
  private acknowledgmentRepository: IAcknowledgmentRepository;

  constructor(acknowledgmentRepository: IAcknowledgmentRepository) {
    this.acknowledgmentRepository = acknowledgmentRepository;
  }

  async execute(featureKey: string, description?: string) {
    const response = await this.acknowledgmentRepository.createFeature(featureKey, description);

    return {
      status: RESPONSE_CODE.CREATED,
      message: 'success',
      data: response,
    };
  }
}

decorate(injectable(), CreateAcknowledgmentFeatureUseCase);

export const createCreateAcknowledgmentFeatureUseCase = (
  acknowledgmentRepository: IAcknowledgmentRepository,
) => {
  return new CreateAcknowledgmentFeatureUseCase(acknowledgmentRepository);
};
