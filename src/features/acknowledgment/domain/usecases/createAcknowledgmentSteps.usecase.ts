import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { decorate, injectable } from 'inversify';
import { AcknowledgmentFeatureStepRequestDto } from '../../data/dto/request';
import { AcknowledgmentSingleFeatureStepsResponse } from '../../data/dto/response';
import { IAcknowledgmentRepository } from '../../repositories/Acknowledgment.repository';

export interface ICreateAcknowledgmentStepsUseCase {
  execute(
    data: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentSingleFeatureStepsResponse>;
}

export class CreateAcknowledgmentStepsUseCase implements ICreateAcknowledgmentStepsUseCase {
  private acknowledgmentRepository: IAcknowledgmentRepository;

  constructor(acknowledgmentRepository: IAcknowledgmentRepository) {
    this.acknowledgmentRepository = acknowledgmentRepository;
  }

  async execute(data: AcknowledgmentFeatureStepRequestDto) {
    const response = await this.acknowledgmentRepository.createFeatureSteps(data);

    return {
      status: RESPONSE_CODE.CREATED,
      message: 'success',
      data: response,
    };
  }
}

decorate(injectable(), CreateAcknowledgmentStepsUseCase);

export const createCreateAcknowledgmentStepsUseCase = (
  acknowledgmentRepository: IAcknowledgmentRepository,
) => {
  return new CreateAcknowledgmentStepsUseCase(acknowledgmentRepository);
};
