import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { decorate, injectable } from 'inversify';
import { SingleAcknowledgmentFeatureStepsResponse } from '../../data/dto/response';
import { IAcknowledgmentRepository } from '../../repositories/Acknowledgment.repository';

export interface IGetAcknowledgmentStepsUseCase {
  execute(featureId: string): Promise<SingleAcknowledgmentFeatureStepsResponse>;
}

export class GetAcknowledgmentStepsUseCase implements IGetAcknowledgmentStepsUseCase {
  private acknowledgmentRepository: IAcknowledgmentRepository;

  constructor(acknowledgmentRepository: IAcknowledgmentRepository) {
    this.acknowledgmentRepository = acknowledgmentRepository;
  }

  async execute(featureId: string) {
    const response = await this.acknowledgmentRepository.getFeatureSteps(featureId);

    return {
      status: RESPONSE_CODE.OK,
      message: 'success',
      data: response,
    };
  }
}

decorate(injectable(), GetAcknowledgmentStepsUseCase);

export const createGetAcknowledgmentStepsUseCase = (
  acknowledgmentRepository: IAcknowledgmentRepository,
) => {
  return new GetAcknowledgmentStepsUseCase(acknowledgmentRepository);
};
