import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { decorate, injectable } from 'inversify';
import { CompleteAcknowledgmentResponse } from '../../data/dto/response/completeAcknowledgmentResponse.dto';
import { IAcknowledgmentRepository } from '../../repositories/Acknowledgment.repository';

export interface ICompleteAcknowledgmentUseCase {
  execute(featureId: string): Promise<CompleteAcknowledgmentResponse>;
}

export class CompleteAcknowledgmentUseCase implements ICompleteAcknowledgmentUseCase {
  private acknowledgmentRepository: IAcknowledgmentRepository;

  constructor(acknowledgmentRepository: IAcknowledgmentRepository) {
    this.acknowledgmentRepository = acknowledgmentRepository;
  }

  async execute(featureId: string) {
    const response = await this.acknowledgmentRepository.updateCompletedFeature(featureId);

    return {
      status: RESPONSE_CODE.OK,
      message: 'success',
      data: response,
    };
  }
}

decorate(injectable(), CompleteAcknowledgmentUseCase);

export const createCompleteAcknowledgmentUseCase = (
  acknowledgmentRepository: IAcknowledgmentRepository,
) => {
  return new CompleteAcknowledgmentUseCase(acknowledgmentRepository);
};
