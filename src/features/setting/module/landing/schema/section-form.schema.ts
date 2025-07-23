import { MediaTypeEnum, SectionTypeEnum } from '@/features/landing/constants';
import * as yup from 'yup';

export const sectionFormSchema = yup.object({
  section_id: yup.string().required(),
  section_type: yup.mixed<SectionTypeEnum>().oneOf(Object.values(SectionTypeEnum)).required(),
  name: yup.string().required('Section name is required'),
  order: yup.number().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  medias: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        media_type: yup.mixed<MediaTypeEnum>().oneOf(Object.values(MediaTypeEnum)).required(),
        media_url: yup
          .string()
          .default(null)
          .when('media_type', {
            is: (val: MediaTypeEnum) => val === MediaTypeEnum.IMAGE || val === MediaTypeEnum.VIDEO,
            then: (schema) => schema.required('Media URL is required'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        redirect_url: yup.string().default(null),
        media_url_2: yup.string().default(null).nullable().notRequired(),
        media_order: yup.number().default(0),
        embed_code: yup
          .string()
          .default(null)
          .when('media_type', {
            is: (val: MediaTypeEnum) => val === MediaTypeEnum.EMBEDDED,
            then: (schema) => schema.required('Embed code is required'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        description: yup.string().default(null).optional(),
        uploaded_by: yup.string().default(null).optional(),
        uploaded_date: yup.date().required(),
        mediaReviewUser: yup
          .object({
            media_user_name: yup.string().optional().nullable(),
            media_user_avatar: yup.string().optional().nullable(),
            media_user_title: yup.string().optional().nullable(),
            media_user_email: yup.string().optional().nullable(),
            media_user_comment: yup.string().optional().nullable(),
            media_user_rating: yup.number().optional().default(0).min(0).max(5).nullable(),
            createdBy: yup.string().optional().nullable(),
            updatedBy: yup.string().optional().nullable(),
          })
          .optional()
          .nullable(),
      }),
    )
    .default([]),
});

export type SectionDefaultValues = yup.InferType<typeof sectionFormSchema>;

export const defaultValues = (sectionType: SectionTypeEnum): SectionDefaultValues => {
  return {
    section_id: `${Date.now()}`,
    section_type: sectionType,
    name: `New ${sectionType.replace('_', ' ')}`,
    order: 0,
    created_at: new Date(),
    updated_at: new Date(),
    medias: [],
  };
};
