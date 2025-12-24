import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { decorate, injectable } from 'inversify';
import { AcknowledgmentFeatureStepsResponse } from '../../data/dto/response';
import { IAcknowledgmentRepository } from '../../repositories/Acknowledgment.repository';

export interface IGetAcknowledgmentUseCase {
  execute(isCompleted: boolean): Promise<AcknowledgmentFeatureStepsResponse>;
}

export class GetAcknowledgmentUseCase implements IGetAcknowledgmentUseCase {
  private acknowledgmentRepository: IAcknowledgmentRepository;

  constructor(acknowledgmentRepository: IAcknowledgmentRepository) {
    this.acknowledgmentRepository = acknowledgmentRepository;
  }

  async execute(isCompleted: boolean) {
    const response = await this.acknowledgmentRepository.getAcknowledgments(isCompleted);

    return {
      status: RESPONSE_CODE.OK,
      message: 'success',
      data: response,
    };
  }
}

decorate(injectable(), GetAcknowledgmentUseCase);

export const createGetAcknowledgmentUseCase = (
  acknowledgmentRepository: IAcknowledgmentRepository,
) => {
  return new GetAcknowledgmentUseCase(acknowledgmentRepository);
};
