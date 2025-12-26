import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { decorate, injectable } from 'inversify';
import { AcknowledgmentFeatureStepRequestDto } from '../../data/dto/request';
import {
  AcknowledgmentFeatureSteps,
  AcknowledgmentStep,
  CompleteAcknowledgmentResponseDto,
} from '../../data/dto/response';
import { AcknowledgmentFeature } from '../../domain/entities';

export interface IAcknowledgmentRepository {
  getAcknowledgments(userId: string, isCompleted: boolean): Promise<AcknowledgmentFeatureSteps[]>;
  getAcknowledgmentStepByFeatureId(featureId: string): Promise<AcknowledgmentStep[]>;
  getFeatureByFeatureKey(featureKey: string): Promise<string | undefined>;
  createFeature(
    userId: string,
    featureKey: string,
    description?: string,
  ): Promise<AcknowledgmentFeature>;
  createFeatureSteps(
    userId: string,
    tour: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentFeatureSteps>;
  createUserAcknowledgments(userId: string): Promise<void>;
  getFeatureSteps(userId: string, featureId: string): Promise<AcknowledgmentFeatureSteps | null>;
  updateCompletedFeature(
    userId: string,
    featureId: string,
  ): Promise<CompleteAcknowledgmentResponseDto>;
}

export class AcknowledgmentRepository implements IAcknowledgmentRepository {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async getAcknowledgments(
    userId: string,
    isCompleted: boolean,
  ): Promise<AcknowledgmentFeatureSteps[]> {
    const response = await this.database.userAcknowledgment.findMany({
      where: { userId, isCompleted, AcknowledgmentFeature: { isActive: true } },
      select: {
        AcknowledgmentFeature: {
          select: {
            id: true,
            featureKey: true,
            description: true,
          },
        },
      },
    });

    const result = response.map((item) => ({
      id: item.AcknowledgmentFeature.id,
      featureKey: item.AcknowledgmentFeature.featureKey,
      description: item.AcknowledgmentFeature.description,
    }));

    return result;
  }

  async getAcknowledgmentStepByFeatureId(featureId: string): Promise<AcknowledgmentStep[]> {
    const response = await this.database.acknowledgmentStep.findMany({
      where: { featureId },
      select: {
        id: true,
        stepOrder: true,
        title: true,
        description: true,
      },
    });

    return response;
  }

  async getFeatureByFeatureKey(featureKey: string): Promise<string | undefined> {
    const response = await this.database.acknowledgmentFeature.findUnique({
      where: { featureKey },
      select: {
        id: true,
      },
    });

    return response?.id;
  }

  async createFeature(
    userId: string,
    featureKey: string,
    description?: string,
  ): Promise<AcknowledgmentFeature> {
    const response = await this.database.acknowledgmentFeature.create({
      data: {
        id: randomUUID(),
        featureKey,
        description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
      },
    });

    return response;
  }

  async createFeatureSteps(
    userId: string,
    tour: AcknowledgmentFeatureStepRequestDto,
  ): Promise<AcknowledgmentFeatureSteps> {
    return await this.database.$transaction(async (tx) => {
      // 1. Check featureId exist
      const featureExist = await tx.acknowledgmentFeature.findUnique({
        where: {
          id: tour.featureId,
        },
      });

      if (!featureExist) {
        throw new Error('Feature not found');
      }

      // 2. Create all steps in the same transaction
      const created = await Promise.all(
        tour.steps.map((step) =>
          tx.acknowledgmentStep.create({
            data: {
              id: randomUUID(),
              featureId: tour.featureId,
              stepOrder: step.stepOrder,
              title: step.title,
              description: step.description,
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: userId,
              updatedBy: userId,
            },
          }),
        ),
      );

      return {
        id: tour.featureId,
        featureKey: featureExist.featureKey,
        description: featureExist.description,
        steps: created,
      };
    });
  }

  async createUserAcknowledgments(userId: string): Promise<void> {
    await this.database.$transaction(async (tx) => {
      // 1. Get all features
      const features = await tx.acknowledgmentFeature.findMany({
        select: { id: true },
      });

      // 2. Prepare data
      const now = new Date();
      const rows = features.map((f) => ({
        id: randomUUID(),
        userId,
        featureId: f.id,
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      }));

      // 3. Bulk insert
      await tx.userAcknowledgment.createMany({ data: rows, skipDuplicates: true });
    });
  }

  async getFeatureSteps(
    userId: string,
    featureId: string,
  ): Promise<AcknowledgmentFeatureSteps | null> {
    const raw = await this.database.acknowledgmentFeature.findUnique({
      where: {
        id: featureId,
        isActive: true,
        UserAcknowledgment: {
          some: {
            userId,
            isCompleted: false,
          },
        },
      },
      select: {
        id: true,
        featureKey: true,
        description: true,
        AcknowledgmentStep: {
          select: {
            id: true,
            stepOrder: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            updatedBy: true,
            featureId: true,
          },
          orderBy: { stepOrder: 'asc' },
        },
      },
    });

    if (!raw) return null;

    return {
      id: raw.id,
      featureKey: raw.featureKey,
      description: raw.description,
      steps: raw.AcknowledgmentStep,
    };
  }

  async updateCompletedFeature(
    userId: string,
    featureId: string,
  ): Promise<CompleteAcknowledgmentResponseDto> {
    const response = await this.database.userAcknowledgment.update({
      where: {
        userId_featureId: {
          userId,
          featureId,
        },
      },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: userId,
      },
      select: {
        AcknowledgmentFeature: {
          select: {
            featureKey: true,
          },
        },
      },
    });

    return response.AcknowledgmentFeature;
  }
}

decorate(injectable(), AcknowledgmentRepository);

export const createAcknowledgmentRepository = (database: PrismaClient) => {
  return new AcknowledgmentRepository(database);
};
