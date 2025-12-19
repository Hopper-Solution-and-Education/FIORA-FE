// src/features/admin/banner/actions/getMediaAction.ts
import { adminContainer } from '@/features/setting/module/landing/di/adminDIContainer';
import { BaseResponse } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IAnnouncement } from '../../domain/entities/Announcement';
import { UpdateAnnouncementUseCase } from '../../domain/usecases/UpdateAnnoucementUseCase';

export const updateAnnouncement = createAsyncThunk<
  BaseResponse<IAnnouncement[]>,
  IAnnouncement[],
  { rejectValue: string }
>('announcement/updateAnnouncement', async (announcement, { rejectWithValue }) => {
  try {
    const updateAnnouncementUseCase =
      adminContainer.get<UpdateAnnouncementUseCase>(UpdateAnnouncementUseCase);
    const updatedAnnouncement = await updateAnnouncementUseCase.execute(announcement);

    return updatedAnnouncement;
  } catch (error) {
    console.log(error);

    return rejectWithValue('Failed to update announcement');
  }
});
