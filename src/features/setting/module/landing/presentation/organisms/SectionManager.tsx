/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SectionTypeEnum } from '@/features/landing/constants';
import { removeFromFirebase, uploadToFirebase } from '@/shared/lib';
import { SectionDefaultValues, sectionFormSchema } from '../../schema/section-form.schema';
import { changeIsLoadingSaveChange, markSectionFetched, sectionMapping } from '../../slices';
import { fetchMediaBySection } from '../../slices/actions/fetchMediaBySection';
import { updateMediaBySection } from '../../slices/actions/updateMediaBySection';
import { ISection } from '../../slices/types';
import { transferDefaultValues } from '../../utils/transferDefaultValue';
import SectionCard from '../molecules/SectionCard';

interface SectionManagerProps {
  sectionType: SectionTypeEnum;
}

export default function SectionManager({ sectionType }: SectionManagerProps) {
  const sectionData = useAppSelector((state) => {
    const landingState = state.landingSettings;
    const sectionKey = sectionMapping[sectionType];
    return sectionKey ? (landingState[sectionKey] as ISection | undefined) : undefined;
  });

  const fetchedSections = useAppSelector((state) => state.landingSettings.fetchedSections);

  const defaultValues = sectionData
    ? transferDefaultValues(sectionData)
    : transferDefaultValues({
        id: '',
        section_type: sectionType,
        name: '',
        order: 0,
        medias: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      });

  const methods = useForm({
    resolver: yupResolver(sectionFormSchema),
    defaultValues: defaultValues,
  });

  const dispatch = useAppDispatch();
  const { data: userData } = useSession();

  const { reset } = methods;

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

  const onSubmit = async (data: SectionDefaultValues) => {
    dispatch(changeIsLoadingSaveChange(true));
    try {
      const processedData: SectionDefaultValues = { ...data };

      processedData.medias = processedData.medias.map((media, idx) => ({
        ...media,
        media_order: idx,
      }));

      const oldMedias = sectionData?.medias || [];

      const updatedMedias = await Promise.all(
        processedData.medias.map(async (media) => {
          const oldMedia = oldMedias.find((m) => m.id === media.id);
          if (oldMedia?.media_url && !oldMedia.media_url.startsWith('blob:')) {
            await removeFromFirebase(oldMedia.media_url);
          }
          if (oldMedia?.media_url_2 && !oldMedia.media_url_2.startsWith('blob:')) {
            await removeFromFirebase(oldMedia.media_url_2);
          }

          let newMediaUrl = media.media_url;
          let newMediaUrl2 = media.media_url_2;

          // Upload media_url if it's a blob
          if (media.media_url && media.media_url.startsWith('blob:')) {
            const response = await fetch(media.media_url);
            const blob = await response.blob();
            const fileName = media.id || 'media';
            newMediaUrl = await uploadToFirebase({
              file: blob,
              path: 'images/media',
              fileName,
            });
          }

          // Upload media_url_2 if it's a blob
          if (media.media_url_2 && media.media_url_2.startsWith('blob:')) {
            const response = await fetch(media.media_url_2);
            const blob = await response.blob();
            const fileName = media.id || 'media_2';
            newMediaUrl2 = await uploadToFirebase({
              file: blob,
              path: 'images/media',
              fileName,
            });
          }

          return {
            ...media,
            media_url: newMediaUrl,
            media_url_2: newMediaUrl2,
            uploaded_by: media.uploaded_by || userData?.user.id || 'system',
            uploaded_date: media.uploaded_date || new Date(),
          };
        }),
      );

      processedData.medias = updatedMedias;

      dispatch(updateMediaBySection({ section: processedData, createdBy: userData?.user.id ?? '' }))
        .unwrap()
        .then(() => {
          toast.success('Success', {
            description: 'Section updated successfully',
          });
        });
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error('Failed to update section');
    } finally {
      dispatch(changeIsLoadingSaveChange(false));
    }
  };

  return (
    <FormProvider {...methods}>
      <SectionCard sectionData={sectionData} control={methods.control} sectionType={sectionType} />

      <div className="flex justify-end space-x-2">
        <TooltipProvider delayDuration={0}>
          <div className="flex justify-end gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={methods.handleSubmit(onSubmit)}
                  disabled={methods.formState.isSubmitting || methods.formState.isValidating}
                  className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {methods.formState.isSubmitting ? (
                    <Icons.spinner className="animate-spin h-5 w-5" />
                  ) : (
                    <Icons.check className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{methods.formState.isSubmitting ? 'Submiting...' : 'Submit'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </FormProvider>
  );
}
