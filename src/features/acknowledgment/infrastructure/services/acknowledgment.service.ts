import { AcknowledgmentFeatureKey } from '@/shared/constants';
import { PrismaClient } from '@prisma/client';
import { AcknowledgmentFeatureStepRequestDto } from '../../data/dto/request';
import {
  AcknowledgmentFeatureSteps,
  CompleteAcknowledgmentResponseDto,
} from '../../data/dto/response';
import { AcknowledgmentFeature } from '../../domain/entities';
import { createAcknowledgmentRepository } from '../repositories/acknowledgment.repository';

const database = new PrismaClient();
const acknowledgmentRepository = createAcknowledgmentRepository(database);

export const getAcknowledgments = async (
  userId: string,
  isCompleted: boolean,
): Promise<AcknowledgmentFeatureSteps[]> => {
  const features = await acknowledgmentRepository.getAcknowledgments(userId, isCompleted);

  // Fetch steps for all features in parallel
  await Promise.all(
    features.map(async (feature) => {
      if (feature.featureKey === AcknowledgmentFeatureKey.HOMEPAGE) {
        const steps = await acknowledgmentRepository.getAcknowledgmentStepByFeatureId(feature.id);
        feature.steps = steps;
      }
    }),
  );

  return features;
};

export const createNewAcknowledgmentFeature = async (
  userId: string,
  featureKey: string,
  description: string,
): Promise<AcknowledgmentFeature> => {
  const featureId = await acknowledgmentRepository.getFeatureByFeatureKey(featureKey);

  if (featureId) {
    throw new Error('Feature key already exists');
  }

  const feature = await acknowledgmentRepository.createFeature(userId, featureKey, description);

  return feature;
};

export const createNewAcknowledgmentFeatureSteps = async (
  userId: string,
  tour: AcknowledgmentFeatureStepRequestDto,
): Promise<AcknowledgmentFeatureSteps> => {
  const stepsResponse = await acknowledgmentRepository.createFeatureSteps(userId, tour);

  return stepsResponse;
};

export const createUserAcknowledgments = async (userId: string): Promise<void> => {
  await acknowledgmentRepository.createUserAcknowledgments(userId);
};

export const getFeatureSteps = async (
  userId: string,
  featureId: string,
): Promise<AcknowledgmentFeatureSteps | null> => {
  const steps = await acknowledgmentRepository.getFeatureSteps(userId, featureId);

  return steps;
};

export const updateCompletedFeature = async (
  userId: string,
  featureKey: string,
): Promise<CompleteAcknowledgmentResponseDto> => {
  const featureId = await acknowledgmentRepository.getFeatureByFeatureKey(featureKey);

  if (!featureId) {
    throw new Error('Feature key not found');
  }

  const response = await acknowledgmentRepository.updateCompletedFeature(userId, featureId);

  return response;
};
