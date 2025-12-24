import { AcknowledgmentFeature, AcknowledgmentFeatureSteps } from '../../domain/entities';
import {
  AcknowledgmentFeatureResponse,
  AcknowledgmentFeatureStepsResponse,
  AcknowledgmentSingleFeatureStepsResponse,
} from '../dto/response';

export class AcknowledgmentMapper {
  static toGetAcknowledgmentResponse(
    response: AcknowledgmentFeatureStepsResponse,
  ): AcknowledgmentFeatureSteps {
    return response.data.reduce((acc, item) => {
      acc[item.featureKey] = item;
      return acc;
    }, {} as AcknowledgmentFeatureSteps);
  }

  static toCreateAcknowledgmentFeatureResponse(
    response: AcknowledgmentFeatureResponse,
  ): AcknowledgmentFeature {
    return {
      id: response.data.id,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      createdBy: response.data.createdBy,
      updatedBy: response.data.updatedBy,
      featureKey: response.data.featureKey,
      description: response.data.description,
    };
  }

  static toCreateAcknowledgmentFeatureStepsResponse(
    response: AcknowledgmentSingleFeatureStepsResponse,
  ): AcknowledgmentFeatureSteps {
    return {
      [response.data.featureKey]: response.data,
    };
  }
}
