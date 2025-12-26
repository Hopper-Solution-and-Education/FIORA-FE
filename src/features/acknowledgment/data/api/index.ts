import { httpClient } from '@/config/http-client/HttpClient';
import { ApiEndpointEnum } from '@/shared/constants';
import { routeConfig } from '@/shared/utils/route';
import { decorate, injectable } from 'inversify';
import { AcknowledgmentFeatureStepRequestDto } from '../dto/request';
import {
  AcknowledgmentFeatureResponse,
  AcknowledgmentFeatureStepsResponse,
  AcknowledgmentSingleFeatureStepsResponse,
  CompleteAcknowledgmentResponse,
  SingleAcknowledgmentFeatureStepsResponse,
} from '../dto/response';

export interface IAcknowledgmentAPI {
  getAcknowledgments(isCompleted: boolean): Promise<AcknowledgmentFeatureStepsResponse>;
  createFeature(featureKey: string, description?: string): Promise<AcknowledgmentFeatureResponse>;
  createFeatureSteps(
    tour: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentSingleFeatureStepsResponse>;
  getFeatureSteps(featureId: string): Promise<SingleAcknowledgmentFeatureStepsResponse>;
  updateCompletedFeature(featureKey: string): Promise<CompleteAcknowledgmentResponse>;
}

class AcknowledgmentAPI implements IAcknowledgmentAPI {
  async getAcknowledgments(isCompleted: boolean): Promise<AcknowledgmentFeatureStepsResponse> {
    return await httpClient.post(ApiEndpointEnum.Acknowledgment, { isCompleted });
  }

  async createFeature(
    featureKey: string,
    description?: string,
  ): Promise<AcknowledgmentFeatureResponse> {
    return await httpClient.post(ApiEndpointEnum.AcknowledgmentFeature, {
      featureKey,
      description,
    });
  }

  async createFeatureSteps(
    tour: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentSingleFeatureStepsResponse> {
    return await httpClient.post(ApiEndpointEnum.AcknowledgmentFeatureSteps, tour);
  }

  async getFeatureSteps(featureId: string): Promise<SingleAcknowledgmentFeatureStepsResponse> {
    return await httpClient.get(
      routeConfig(
        ApiEndpointEnum.AcknowledgmentFeatureSteps,
        {},
        {
          featureId,
        },
      ),
    );
  }

  async updateCompletedFeature(featureKey: string): Promise<CompleteAcknowledgmentResponse> {
    return await httpClient.patch(ApiEndpointEnum.AcknowledgmentFeature, { featureKey });
  }
}

decorate(injectable(), AcknowledgmentAPI);

export const createAcknowledgmentAPI = (): IAcknowledgmentAPI => {
  return new AcknowledgmentAPI();
};

export { AcknowledgmentAPI };
