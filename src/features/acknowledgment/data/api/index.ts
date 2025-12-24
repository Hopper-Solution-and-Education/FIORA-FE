import { httpClient } from '@/config/http-client/HttpClient';
import { ApiEndpointEnum } from '@/shared/constants';
import { decorate, injectable } from 'inversify';
import { AcknowledgmentFeatureStepRequestDto } from '../dto/request';
import {
  AcknowledgmentFeatureResponse,
  AcknowledgmentFeatureStepsResponse,
  AcknowledgmentSingleFeatureStepsResponse,
} from '../dto/response';

export interface IAcknowledgmentAPI {
  getAcknowledgments(isCompleted: boolean): Promise<AcknowledgmentFeatureStepsResponse>;
  createFeature(featureKey: string, description?: string): Promise<AcknowledgmentFeatureResponse>;
  createFeatureSteps(
    tour: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentSingleFeatureStepsResponse>;
}

class AcknowledgmentAPI implements IAcknowledgmentAPI {
  async getAcknowledgments(isCompleted: boolean): Promise<AcknowledgmentFeatureStepsResponse> {
    return await httpClient.post(ApiEndpointEnum.Acknowledgment, { isCompleted });
  }

  async createFeature(
    featureKey: string,
    description?: string,
  ): Promise<AcknowledgmentFeatureResponse> {
    return await httpClient.post(ApiEndpointEnum.AcknowledgmentFeatureCreate, {
      featureKey,
      description,
    });
  }

  async createFeatureSteps(
    tour: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentSingleFeatureStepsResponse> {
    return await httpClient.post(ApiEndpointEnum.AcknowledgmentFeatureStepsCreate, tour);
  }
}

decorate(injectable(), AcknowledgmentAPI);

export const createAcknowledgmentAPI = (): IAcknowledgmentAPI => {
  return new AcknowledgmentAPI();
};

export { AcknowledgmentAPI };
