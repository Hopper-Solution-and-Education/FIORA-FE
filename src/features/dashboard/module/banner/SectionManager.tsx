'use client';

import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { MediaType, SectionType } from '@prisma/client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Section } from './schema';
import SectionCard from './SectionCard';

const schema = yup.object({
  section_id: yup.number().required(),
  section_type: yup.mixed<SectionType>().oneOf(Object.values(SectionType)).required(),
  name: yup.string().required('Section name is required'),
  order: yup.number().required(),
  medias: yup.array().of(
    yup.object({
      id: yup.number().required(),
      media_type: yup.mixed<MediaType>().oneOf(Object.values(MediaType)).required(),
      media_url: yup.string().when('media_type', {
        is: (val: MediaType) => val === MediaType.IMAGE || val === MediaType.VIDEO,
        then: (schema) => schema.required('Media URL is required'),
        otherwise: (schema) => schema.optional(),
      }),
      embed_code: yup.string().when('media_type', {
        is: MediaType.EMBEDDED,
        then: (schema) => schema.required('Embed code is required'),
        otherwise: (schema) => schema.optional(),
      }),
    }),
  ),
});

interface SectionManagerProps {
  section: Section | undefined;
  onSave: (section: Section) => void;
  sectionType: SectionType;
}

export default function SectionManager({ section, onSave, sectionType }: SectionManagerProps) {
  // Create a default section if none is provided
  const defaultSection: Section = {
    section_id: Date.now(),
    section_type: sectionType,
    name: `New ${sectionType.replace('_', ' ')}`,
    order: 0,
    created_at: new Date(),
    updated_at: new Date(),
    medias: [],
  };

  const { control, handleSubmit, reset } = useForm<Section>({
    resolver: yupResolver(schema),
    defaultValues: section || defaultSection,
  });

  // Update form when section prop changes
  useEffect(() => {
    if (section) {
      reset(section);
    }
  }, [section]);

  const onSubmit = (data: Section) => {
    onSave(data);
  };

  return (
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
        <SectionCard control={control} sectionType={sectionType} />
      </div>
    </div>
  );
}
