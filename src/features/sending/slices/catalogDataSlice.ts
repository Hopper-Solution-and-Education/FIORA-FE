import { httpClient } from '@/config';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface CatalogState {
  categories: any[];
  products: any[];
}

interface CatalogRootState {
  catalog: CatalogState;
  isLoading: boolean;
  isFetched: boolean;
}

const initialState: CatalogRootState = {
  catalog: { categories: [], products: [] },
  isLoading: false,
  isFetched: false,
};
export const fetchCatalogDataAsync = createAsyncThunk(
  'catalogData/fetchCatalog',
  async (_, { rejectWithValue }) => {
    try {
      const json = await httpClient.get<{ data: any }>('/api/sending-wallet/catalog');
      const d = json.data;
      return {
        categories: d.categories || [],
        products: d.products || [],
      };
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch catalog');
      return rejectWithValue(e.message || 'Failed to fetch catalog');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { catalogData: { isLoading: boolean; isFetched: boolean } };
      if (state.catalogData.isLoading) {
        return false;
      }
      if (state.catalogData.isFetched) {
        return false;
      }
      return true;
    },
  },
);

const catalogDataSlice = createSlice({
  name: 'catalogData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogDataAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCatalogDataAsync.fulfilled, (state, action: PayloadAction<CatalogState>) => {
        state.isLoading = false;
        state.catalog = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchCatalogDataAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default catalogDataSlice.reducer;
