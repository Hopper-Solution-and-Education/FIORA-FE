import { TYPES } from '@/features/admin/di/adminDIContainer.type';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { SectionDefaultValues } from '../../schema/section-form.schema';
import { ISection } from '../../slices/types';
import type { ISectionAPI } from '../api/sectionApi';

export interface ISectionRepository {
  getSection: (sectionType: SectionType) => Promise<ISection>;
  updateSection: (section: SectionDefaultValues, createdBy: string) => Promise<ISection>;
}
// FIX
export const mapSectionDefaultValuesToISection = (
  section: SectionDefaultValues,
  createdBy: string,
): ISection => {
  return {
    id: section.section_id,
    section_type: section.section_type,
    name: section.name,
    order: section.order,
    createdAt: section.created_at,
    updatedAt: section.updated_at,
    medias: section.medias.map((media) => ({
      id: media.id,
      media_url: media.media_url,
      media_type: media.media_type,
      redirect_url: media.redirect_url,
      embed_code: media.embed_code,
      description: media.description,
      uploaded_by: createdBy,
      uploaded_date: media.uploaded_date,
      section_id: section.section_id,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: createdBy,
      updatedBy: createdBy,
    })),
    createdBy: createdBy,
    updatedBy: createdBy,
  };
};

@injectable()
export class SectionRepository implements ISectionRepository {
  private sectionApi: ISectionAPI;

  constructor(@inject(TYPES.ISectionAPI) sectionApi: ISectionAPI) {
    this.sectionApi = sectionApi;
  }

  async getSection(sectionType: SectionType): Promise<ISection> {
    return await this.sectionApi.fetchSection(sectionType);
  }

  async updateSection(section: SectionDefaultValues, createdBy: string): Promise<ISection> {
    const mappedSection = mapSectionDefaultValuesToISection(section, createdBy);
    console.log('====================================');
    console.log(mappedSection);
    console.log('====================================');
    return await this.sectionApi.updateSection(mappedSection);
  }
}
