import { SectionTypeEnum } from '@/features/landing/constants';
import { decorate, injectable } from 'inversify';
import { SectionDefaultValues } from '../../schema/section-form.schema';
import { ISection } from '../../slices/types';
import type { ISectionAPI } from '../api/sectionApi';

export interface ISectionRepository {
  getSection: (sectionType: SectionTypeEnum) => Promise<ISection>;
  updateSection: (section: SectionDefaultValues, createdBy: string) => Promise<ISection>;
}

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
    medias: section.medias.map((media) => {
      let mediaReviewUser = null;
      if (media.mediaReviewUser) {
        mediaReviewUser = {
          media_user_name: media.mediaReviewUser.media_user_name || '',
          media_user_avatar: media.mediaReviewUser.media_user_avatar || '',
          media_user_comment: media.mediaReviewUser.media_user_comment || '',
          media_user_rating: media.mediaReviewUser.media_user_rating ?? 0,
          media_user_email: media.mediaReviewUser.media_user_email || '',
          createdBy: media.mediaReviewUser.createdBy || '',
          updatedBy: media.mediaReviewUser.updatedBy || '',
        };
      }
      const mappedMedia = {
        id: media.id,
        media_url: media.media_url,
        media_url_2: media.media_url_2,
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
        media_order: media.media_order,
        mediaReviewUser,
      };
      return mappedMedia;
    }),
    createdBy: createdBy,
    updatedBy: createdBy,
  };
};

// Define the class without decorators
export class SectionRepository implements ISectionRepository {
  private sectionApi: ISectionAPI;

  constructor(sectionApi: ISectionAPI) {
    this.sectionApi = sectionApi;
  }

  async getSection(sectionType: SectionTypeEnum): Promise<ISection> {
    return await this.sectionApi.fetchSection(sectionType);
  }

  async updateSection(section: SectionDefaultValues, createdBy: string): Promise<ISection> {
    const mappedSection = mapSectionDefaultValuesToISection(section, createdBy);
    return await this.sectionApi.updateSection(mappedSection);
  }
}

// Apply decorators programmatically
decorate(injectable(), SectionRepository);

// Create a factory function that handles the injection
export const createSectionRepository = (sectionApi: ISectionAPI): ISectionRepository => {
  return new SectionRepository(sectionApi);
};
