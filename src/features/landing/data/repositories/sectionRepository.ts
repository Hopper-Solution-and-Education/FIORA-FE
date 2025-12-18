import { decorate, injectable } from 'inversify';
import { SectionTypeEnum } from '../../constants';
import { ISection } from '../../domain/interfaces/Section';
import type { ILandingAPI } from '../api/api';

export interface ISectionRepository {
  getSection(sectionType: SectionTypeEnum): Promise<ISection>;
}

export class SectionRepository implements ISectionRepository {
  private landingAPI: ILandingAPI;

  constructor(landingAPI: ILandingAPI) {
    this.landingAPI = landingAPI;
  }

  async getSection(sectionType: SectionTypeEnum): Promise<ISection> {
    const response = await this.landingAPI.fetchSection(sectionType);
    return response.data;
  }
}

// Apply decorators programmatically
decorate(injectable(), SectionRepository);

// Create a factory function
export const createSectionRepository = (landingAPI: ILandingAPI): ISectionRepository => {
  return new SectionRepository(landingAPI);
};
