import emailTemplateServices from '@/features/email-template/services';
import { Notification, Response } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEmailTemplates = createAsyncThunk(
  'email-template/fetchEmailTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<Array<Notification>> =
        await emailTemplateServices.fetchEmailTemplates();
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch email templates! Please try again!',
      });
    }
  },
);
