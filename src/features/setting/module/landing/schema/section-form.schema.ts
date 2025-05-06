import { MediaType, SectionType } from '@prisma/client';
import * as yup from 'yup';

export const sectionFormSchema = yup.object({
  section_id: yup.string().required(),
  section_type: yup.mixed<SectionType>().oneOf(Object.values(SectionType)).required(),
  name: yup.string().required('Section name is required'),
  order: yup.number().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  medias: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        media_type: yup.mixed<MediaType>().oneOf(Object.values(MediaType)).required(),
        media_url: yup
          .string()
          .default(null)
          .when('media_type', {
            is: (val: MediaType) => val === MediaType.IMAGE || val === MediaType.VIDEO,
            then: (schema) => schema.required('Media URL is required'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        redirect_url: yup.string().default(null),
        embed_code: yup
          .string()
          .default(null)
          .when('media_type', {
            is: (val: MediaType) => val === MediaType.EMBEDDED,
            then: (schema) => schema.required('Embed code is required'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        description: yup.string().default(null).optional(),
        uploaded_by: yup.string().default(null).optional(),
        uploaded_date: yup.date().required(),
      }),
    )
    .default([]),
});

export type SectionDefaultValues = yup.InferType<typeof sectionFormSchema>;

export const defaultValues = (sectionType: SectionType): SectionDefaultValues => {
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
