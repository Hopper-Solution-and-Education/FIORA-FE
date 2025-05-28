import { createAsyncThunk } from '@reduxjs/toolkit';
import { Partner } from '../../domain/entities/Partner';
import { GlobalFilters } from '@/shared/types';

export const searchPartners = createAsyncThunk<Partner[], GlobalFilters, { rejectValue: string }>(
  'partner/searchPartners',
  async (filters, { rejectWithValue }) => {
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
      return result.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search partners');
    }
  },
);
