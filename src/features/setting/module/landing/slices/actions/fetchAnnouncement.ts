// src/features/admin/banner/actions/getMediaAction.ts
import { adminContainer } from '@/features/setting/module/landing/di/adminDIContainer';
import { HttpResponse } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IAnnouncement } from '../../domain/entities/Announcement';
import { GetAnnouncementUseCase } from '../../domain/usecases/GetAnnoucementUseCase';

export const fetchAnnouncement = createAsyncThunk<
  HttpResponse<IAnnouncement[]>,
  void,
  { rejectValue: string }
>('announcement/fetchAnnouncement', async (_, { rejectWithValue }) => {
  try {
    const getAnnouncementUseCase =
      adminContainer.get<GetAnnouncementUseCase>(GetAnnouncementUseCase);
    const announcement = await getAnnouncementUseCase.execute();

    return announcement;
  } catch (error) {
    console.log(error);

    return rejectWithValue('Failed to fetch announcement');
  }
});
