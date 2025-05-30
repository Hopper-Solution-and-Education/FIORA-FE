import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalFilters } from '@/shared/types';
import { Response } from '@/shared/types/Common.types';
import { PartnerResponse } from '../types';

export const searchPartners = createAsyncThunk<
  Response<PartnerResponse>,
  GlobalFilters,
  { rejectValue: string }
>('partner/searchPartners', async (filters, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/partners/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error('Failed to search partners');
    }

    const result = await response.json();
    // Return the full API response structure
    return result;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to search partners');
  }
});
