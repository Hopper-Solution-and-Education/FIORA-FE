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
      mediaReviewUser: media.mediaReviewUser
        ? {
            media_user_name: media.mediaReviewUser.media_user_name || '',
            media_user_avatar: media.mediaReviewUser.media_user_avatar || '',
            media_user_comment: media.mediaReviewUser.media_user_comment || '',
            media_user_rating: media.mediaReviewUser.media_user_rating || 0,
            media_user_email: media.mediaReviewUser.media_user_email || '',
            createdBy: media.mediaReviewUser.createdBy || '',
            updatedBy: media.mediaReviewUser.updatedBy || '',
          }
        : null,
    })),
    created_at: new Date(data.createdAt),
    updated_at: new Date(data.updatedAt),
  };
};
