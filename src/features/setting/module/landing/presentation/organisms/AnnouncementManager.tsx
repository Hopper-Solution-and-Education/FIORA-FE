'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { IAnnouncement } from '../../domain/entities/Announcement';
import {
  announcementListDefaultValues,
  AnnouncementListForm,
  announcementListFormSchema,
} from '../../schema/announcement.schema';
import { fetchAnnouncement } from '../../slices/actions/fetchAnnouncement';
import { updateAnnouncement } from '../../slices/actions/updateAnnouncement';
import AnnouncementForm from '../molecules/AnnouncementForm';

export default function AnnouncementManager() {
  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);
  const isLoading = useAppSelector((state) => state.landingSettings.isLoading);
  const isLoadingUpdateAnnouncement = useAppSelector(
    (state) => state.landingSettings.isLoadingUpdateAnnouncement,
  );
  const dispatch = useAppDispatch();

  const methods = useForm<AnnouncementListForm>({
    resolver: yupResolver(announcementListFormSchema),
    defaultValues: announcementListDefaultValues(),
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: 'announcements',
  });

  useEffect(() => {
    dispatch(fetchAnnouncement())
      .unwrap()
      .then((announcements) => {
        if (announcements && announcements.data && announcements.data.length > 0) {
          methods.reset({ announcements: announcements.data });
        }
      });
  }, []);

  const onSubmit = async (data: AnnouncementListForm) => {
    dispatch(updateAnnouncement(data.announcements as IAnnouncement[]))
      .unwrap()
      .then((announcements) => {
        toast.success(announcements.message);
        if (announcements && announcements.data && announcements.data.length > 0) {
          methods.reset({ announcements: announcements.data });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <FormProvider {...methods}>
      <Card className="mb-4 p-4">
        <CardHeader className="flex flex-row items-center justify-between py-2 md:py-3 px-2 md:px-4">
          <div className="flex items-center justify-between w-full mb-4">
            <CardTitle className="text-base md:text-lg lg:text-xl font-bold">
              Announcement
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-2 md:px-4 pb-4">
          {fields.map((item, idx) => (
            <AnnouncementForm key={item.id || idx} index={idx} />
          ))}
        </CardContent>
      </Card>

      <TooltipProvider delayDuration={0}>
        <div className="flex justify-end gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={
                  methods.formState.isSubmitting ||
                  methods.formState.isValidating ||
                  isLoadingSaveChange ||
                  isLoading ||
                  isLoadingUpdateAnnouncement
                }
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
    </FormProvider>
  );
}
