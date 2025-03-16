import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../di/landingDIContainer.type';
import { ISection } from '../../domain/interfaces/Section';
import type { ILandingAPI } from '../api/api';

export interface ISectionRepository {
  getSection(sectionType: SectionType): Promise<ISection>;
}

@injectable()
export class SectionRepository implements ISectionRepository {
  private landingAPI: ILandingAPI;

  constructor(@inject(TYPES.ILandingAPI) landingAPI: ILandingAPI) {
    this.landingAPI = landingAPI;
  }

  async getSection(sectionType: SectionType): Promise<ISection> {
    const response = await this.landingAPI.fetchSection(sectionType);
    return response;
  }
}
