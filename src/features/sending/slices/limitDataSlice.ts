import { httpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface LimitState {
  dailyMovingLimit: number;
  oneTimeMovingLimit: number;
  movedAmount: number;
  availableLimit: number;
  packageFXs: number[];
}

interface LimitRootState {
  limit: LimitState | null;
  isLoading: boolean;
  isFetched: boolean;
}

const initialState: LimitRootState = {
  limit: null,
  isLoading: false,
  isFetched: false,
};

export const fetchLimitDataAsync = createAsyncThunk(
  'limitData/fetchLimit',
  async (_, { rejectWithValue }) => {
    try {
      const json = await httpClient.get<{ data: any }>(ApiEndpointEnum.SendingWalletAmountLimit);
      const d = json.data;
      return {
        dailyMovingLimit: d.dailyMovingLimit?.amount || 0,
        oneTimeMovingLimit: d.oneTimeMovingLimit?.amount || 0,
        movedAmount: d.movedAmount?.amount || 0,
        availableLimit: d.availableLimit?.amount || 0,
        packageFXs: d.packageFXs || [],
      };
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch limit');
      return rejectWithValue(e.message || 'Failed to fetch limit');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { limitData: { isLoading: boolean; isFetched: boolean } };

      if (state.limitData.isLoading || state.limitData.isFetched) return false;
      return true;
    },
  },
);

const limitDataSlice = createSlice({
  name: 'limitData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLimitDataAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLimitDataAsync.fulfilled, (state, action: PayloadAction<LimitState>) => {
        state.isLoading = false;
        state.limit = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchLimitDataAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default limitDataSlice.reducer;
