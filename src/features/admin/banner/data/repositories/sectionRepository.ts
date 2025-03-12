import { TYPES } from '@/features/admin/di/adminDIContainer.type';
import { Section, SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import type { ISectionAPI } from '../api/sectionApi';

export interface ISectionRepository {
  getSection: (sectionType: SectionType) => Promise<Section>;
}

@injectable()
export class SectionRepository implements ISectionRepository {
  private sectionApi: ISectionAPI;

  constructor(@inject(TYPES.ISectionAPI) sectionApi: ISectionAPI) {
    this.sectionApi = sectionApi;
  }

  async getSection(sectionType: SectionType): Promise<Section> {
    return await this.sectionApi.fetchSection(sectionType);
  }
}
