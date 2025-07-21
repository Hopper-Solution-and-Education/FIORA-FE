import { MediaTypeEnum } from '@/features/landing/constants';
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
      media_type: media.media_type as MediaTypeEnum,
      media_url:
        media.media_type === MediaTypeEnum.IMAGE || media.media_type === MediaTypeEnum.VIDEO
          ? media.media_url || ''
          : '',
      media_url_2:
        media.media_type === MediaTypeEnum.IMAGE || media.media_type === MediaTypeEnum.VIDEO
          ? media.media_url_2 || ''
          : '',
      redirect_url: media.redirect_url || '',
      embed_code: media.media_type === MediaTypeEnum.EMBEDDED ? media.embed_code || '' : '',
      description: media.description || '',
      uploaded_by: media.uploaded_by || '',
      uploaded_date: media.uploaded_date ? new Date(media.uploaded_date) : new Date(),
      media_order: media.media_order,
    })),
    created_at: new Date(data.createdAt),
    updated_at: new Date(data.updatedAt),
  };
};
