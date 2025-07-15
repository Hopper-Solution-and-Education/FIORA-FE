import { MediaType } from '@prisma/client';
import { SectionDefaultValues } from '../schema/section-form.schema';
import { ISection } from '../slices/types';

export const transferDefaultValues = (data: ISection): SectionDefaultValues => {
  return {
    section_id: data.id,
    section_type: data.section_type,
    name: data.name,
    order: data.order,
    medias: data.medias.map((media) => ({
      id: media.id,
      media_type: media.media_type,
      media_url:
        media.media_type === MediaType.IMAGE || media.media_type === MediaType.VIDEO
          ? media.media_url || ''
          : '',
      redirect_url: media.redirect_url || '',
      embed_code: media.media_type === MediaType.EMBEDDED ? media.embed_code || '' : '',
      description: media.description || '',
      uploaded_by: media.uploaded_by || '',
      uploaded_date: media.uploaded_date ? new Date(media.uploaded_date) : new Date(),
    })),
    created_at: new Date(data.createdAt),
    updated_at: new Date(data.updatedAt),
  };
};
