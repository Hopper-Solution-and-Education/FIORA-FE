'use client';

import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { MediaType, SectionType } from '@prisma/client';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Section } from '../../schema/media.schema';
import SectionCard from './SectionCard';

const schema = yup.object({
  section_id: yup.number().required(),
  section_type: yup.mixed<SectionType>().oneOf(Object.values(SectionType)).required(),
  name: yup.string().required('Section name is required'),
  order: yup.number().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  medias: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required(),
        media_type: yup.mixed<MediaType>().oneOf(Object.values(MediaType)).required(),
        media_url: yup
          .string()
          .default(null)
          .when('media_type', {
            is: (val: MediaType) => val === MediaType.IMAGE || val === MediaType.VIDEO,
            then: (schema) => schema.required('Media URL is required'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
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

interface SectionManagerProps {
  section: Section | undefined;
  onSave: (section: Section) => void;
  sectionType: SectionType;
}

export default function SectionManager({ section, onSave, sectionType }: SectionManagerProps) {
  const defaultSection = {
    section_id: Date.now(),
    section_type: sectionType,
    name: `New ${sectionType.replace('_', ' ')}`,
    order: 0,
    created_at: new Date(),
    updated_at: new Date(),
    medias: [],
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultSection,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (section) {
      reset(section);
    }
  }, [section]);

  const onSubmit = (data: Section) => {
    onSave(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{sectionType.replace('_', ' ')} Section</h2>
          <div className="flex space-x-2">
            <Button onClick={handleSubmit(onSubmit)} variant="default">
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard control={methods.control} sectionType={sectionType} />
        </div>
      </div>
    </FormProvider>
  );
}
