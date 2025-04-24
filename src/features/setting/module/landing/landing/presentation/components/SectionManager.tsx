'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { MediaType, SectionType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  defaultValues,
  SectionDefaultValues,
  sectionFormSchema,
} from '../../schema/section-form.schema';
import { changeIsLoadingSaveChange, markSectionFetched, sectionMapping } from '../../slices';
import { fetchMediaBySection } from '../../slices/actions/fetchMediaBySection';
import { updateMediaBySection } from '../../slices/actions/updateMediaBySection';
import { ISection } from '../../slices/types';
import SectionCard from './SectionCard';
import { removeFromFirebase, uploadToFirebase } from '@/shared/lib';

interface SectionManagerProps {
  sectionType: SectionType;
}

export default function SectionManager({ sectionType }: SectionManagerProps) {
  const sectionData = useAppSelector((state) => {
    const landingState = state.landingSettings;
    const sectionKey = sectionMapping[sectionType];
    return sectionKey ? (landingState[sectionKey] as ISection | undefined) : undefined;
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

  const methods = useForm({
    resolver: yupResolver(sectionFormSchema),
    defaultValues: defaultValues(sectionType),
  });

  const dispatch = useAppDispatch();
  const { data: userData } = useSession();

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (!fetchedSections.includes(sectionType)) {
      dispatch(fetchMediaBySection(sectionType))
        .unwrap()
        .then(() => {
          dispatch(markSectionFetched(sectionType));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sectionData) {
      reset(transferDefaultValues(sectionData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionData]);

  const onSubmit = async (data: SectionDefaultValues) => {
    dispatch(changeIsLoadingSaveChange(true));
    try {
      const processedData: SectionDefaultValues = { ...data };

      // Lấy danh sách medias cũ từ sectionData để so sánh
      const oldMedias = sectionData?.medias || [];

      // Xử lý từng media item
      const updatedMedias = await Promise.all(
        processedData.medias.map(async (media) => {
          const oldMedia = oldMedias.find((m) => m.id === media.id); // Tìm media cũ tương ứng

          if (media.media_url && media.media_url.startsWith('blob:')) {
            // Nếu có URL cũ và không phải blob, xóa nó trước
            if (oldMedia?.media_url && !oldMedia.media_url.startsWith('blob:')) {
              await removeFromFirebase(oldMedia.media_url);
            }

            // Upload file mới
            const response = await fetch(media.media_url);
            const blob = await response.blob();
            const fileName = media.id || 'media';
            const firebaseUrl = await uploadToFirebase({
              file: blob,
              path: 'images/media',
              fileName,
            });

            return {
              ...media,
              media_url: firebaseUrl,
              uploaded_by: media.uploaded_by || userData?.user.id || 'system',
              uploaded_date: media.uploaded_date || new Date(),
            };
          }
          return media;
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {sectionType === 'KPS' ? 'KSP' : sectionType.replace('_', ' ')} Section
          </h2>
          <div className="flex space-x-2">
            <Button onClick={handleSubmit((data) => onSubmit(data))} variant="default">
              <Icons.saveAll /> <span>Save</span>
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
