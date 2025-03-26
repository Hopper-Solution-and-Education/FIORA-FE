import { SectionType } from '@prisma/client';
import { decorate, injectable } from 'inversify';
import { ISection } from '../../domain/interfaces/Section';
import type { ILandingAPI } from '../api/api';

export interface ISectionRepository {
  getSection(sectionType: SectionType): Promise<ISection>;
}

export class SectionRepository implements ISectionRepository {
  private landingAPI: ILandingAPI;

  constructor(landingAPI: ILandingAPI) {
    this.landingAPI = landingAPI;
  }

  async getSection(sectionType: SectionType): Promise<ISection> {
    const response = await this.landingAPI.fetchSection(sectionType);
    return response;
  }
}

// Apply decorators programmatically
decorate(injectable(), SectionRepository);

// Create a factory function
export const createSectionRepository = (landingAPI: ILandingAPI): ISectionRepository => {
  return new SectionRepository(landingAPI);
};
