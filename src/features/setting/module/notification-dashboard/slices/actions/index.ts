import { createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationFilterOptions } from '../../data/dto/response/NotificationFilterOptionsResponse';
import { notificationDashboardContainer } from '../../di/notificationDashboardDIContainer';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';
import { IGetFilterOptionsUseCase } from '../../domain/usecase/GetFilterOptionsUseCase';

export const fetchFilterOptionsAsyncThunk = createAsyncThunk<
  NotificationFilterOptions,
  void,
  { rejectValue: string }
>('notificationDashboard/fetchFilterOptions', async (_, { rejectWithValue }) => {
  try {
    const useCase = notificationDashboardContainer.get<IGetFilterOptionsUseCase>(
      NOTIFICATION_DASHBOARD_TYPES.IGetFilterOptionsUseCase,
    );
    const result = await useCase.execute();
    return result;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch filter options');
  }
});
