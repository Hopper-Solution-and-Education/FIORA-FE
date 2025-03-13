'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { MediaType, SectionType } from '@prisma/client';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { markSectionFetched } from '../../slices';
import { fetchMediaBySection } from '../../slices/actions/fetchMediaBySection';
import { ISection } from '../../slices/types';
import SectionCard from './SectionCard';

const schema = yup.object({
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

type SectionDefaultValues = yup.InferType<typeof schema>;

interface SectionManagerProps {
  sectionType: SectionType;
}

export default function SectionManager({ sectionType }: SectionManagerProps) {
  const defaultValues: SectionDefaultValues = {
    section_id: `${Date.now()}`,
    section_type: sectionType,
    name: `New ${sectionType.replace('_', ' ')}`,
    order: 0,
    created_at: new Date(),
    updated_at: new Date(),
    medias: [],
  };
  const sectionData = useAppSelector((state) => {
    switch (sectionType) {
      case SectionType.BANNER:
        return state.landingSettings.bannerSection;
      case SectionType.VISION_MISSION:
        return state.landingSettings.visionSection;
      case SectionType.KPS:
        return state.landingSettings.kpsSection;
      case SectionType.PARTNER_LOGO:
        return state.landingSettings.partnerSection;
      default:
        return undefined;
    }
  });

  const fetchedSections = useAppSelector((state) => state.landingSettings.fetchedSections);

  const transferDefaultValues = (data: ISection): SectionDefaultValues => {
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
      created_at: new Date(data.createdAt), // Chuyển thành `Date`
      updated_at: new Date(data.updatedAt), // Chuyển thành `Date`
    };
  };

  // // Handler for saving each section type
  // const handleSaveBanner = (section: Section) => {
  //   dispatch(saveSection({ section, sectionType: SectionType.BANNER }));
  // };

  // const handleSaveVision = (section: Section) => {
  //   dispatch(saveSection({ section, sectionType: SectionType.VISION_MISSION }));
  // };

  // const handleSaveKps = (section: Section) => {
  //   dispatch(saveSection({ section, sectionType: SectionType.KPS }));
  // };

  // const handleSavePartner = (section: Section) => {
  //   dispatch(saveSection({ section, sectionType: SectionType.PARTNER_LOGO }));
  // };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const dispatch = useAppDispatch();

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (!fetchedSections.includes(sectionType)) {
      dispatch(fetchMediaBySection(sectionType))
        .unwrap()
        .then(() => {
          dispatch(markSectionFetched(sectionType));
        });
    }
  }, []);

  useEffect(() => {
    if (sectionData) {
      reset(transferDefaultValues(sectionData));
    }
  }, [sectionData]);

  const onSubmit = (data: SectionDefaultValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{sectionType.replace('_', ' ')} Section</h2>
          <div className="flex space-x-2">
            <Button onClick={handleSubmit((data) => onSubmit(data))} variant="default">
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard
            sectionData={sectionData}
            control={methods.control}
            sectionType={sectionType}
          />
        </div>
      </div>
    </FormProvider>
  );
}
