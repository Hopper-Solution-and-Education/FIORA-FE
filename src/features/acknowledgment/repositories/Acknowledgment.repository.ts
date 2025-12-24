import { decorate, injectable } from 'inversify';
import { IAcknowledgmentAPI } from '../data/api';
import { AcknowledgmentFeatureStepRequestDto } from '../data/dto/request';
import { AcknowledgmentFeatureSteps } from '../data/dto/response';
import { AcknowledgmentFeature } from '../domain/entities';

export interface IAcknowledgmentRepository {
  getAcknowledgments(isCompleted: boolean): Promise<AcknowledgmentFeatureSteps[]>;
  createFeature(featureKey: string, description?: string): Promise<AcknowledgmentFeature>;
  createFeatureSteps(
    data: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentFeatureSteps>;
}

export class AcknowledgmentRepository implements IAcknowledgmentRepository {
  private acknowledgmentApi: IAcknowledgmentAPI;

  constructor(acknowledgmentApi: IAcknowledgmentAPI) {
    this.acknowledgmentApi = acknowledgmentApi;
  }

  async getAcknowledgments(isCompleted: boolean): Promise<AcknowledgmentFeatureSteps[]> {
    const response = await this.acknowledgmentApi.getAcknowledgments(isCompleted);
    return response.data;
  }

  async createFeature(featureKey: string, description?: string): Promise<AcknowledgmentFeature> {
    const response = await this.acknowledgmentApi.createFeature(featureKey, description);
    return response.data;
  }

  async createFeatureSteps(
    data: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentFeatureSteps> {
    const response = await this.acknowledgmentApi.createFeatureSteps(data);
    return response.data;
  }
}
decorate(injectable(), AcknowledgmentRepository);

export const createAcknowledgmentRepository = (acknowledgmentApi: IAcknowledgmentAPI) => {
  return new AcknowledgmentRepository(acknowledgmentApi);
};
