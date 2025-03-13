import { TYPES } from '@/features/admin/di/adminDIContainer.type';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ISection } from '../../slices/types';
import type { ISectionAPI } from '../api/sectionApi';

export interface ISectionRepository {
  getSection: (sectionType: SectionType) => Promise<ISection>;
}

@injectable()
export class SectionRepository implements ISectionRepository {
  private sectionApi: ISectionAPI;

  constructor(@inject(TYPES.ISectionAPI) sectionApi: ISectionAPI) {
    this.sectionApi = sectionApi;
  }

  async getSection(sectionType: SectionType): Promise<ISection> {
    return await this.sectionApi.fetchSection(sectionType);
  }
}
