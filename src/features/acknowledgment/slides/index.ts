import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { createAcknowledgmentFeatureAsyncThunk } from './actions/createAcknowledgmentFeatureAsyncThunk';
import { createAcknowledgmentFeatureStepsAsyncThunk } from './actions/createAcknowledgmentFeatureStepsAsyncThunk';
import { getAcknowledgmentAsyncThunk } from './actions/getAcknowledgmentAsyncThunk';
import { initialAcknowledgmentState } from './types';

const acknowledgmentSlides = createSlice({
  name: 'acknowledgment',
  initialState: initialAcknowledgmentState,
  reducers: {
    resetAcknowledgment: () => initialAcknowledgmentState,
  },
  extraReducers: (builder) => {
    builder.addCase(getAcknowledgmentAsyncThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAcknowledgmentAsyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoaded = true;
      state.data = action.payload;
    });
    builder.addCase(getAcknowledgmentAsyncThunk.rejected, (state) => {
      state.isLoading = false;
      state.isLoaded = true;
    });

    builder.addCase(createAcknowledgmentFeatureAsyncThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createAcknowledgmentFeatureAsyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;

      toast.success('Create acknowledgment feature successfully');
    });
    builder.addCase(createAcknowledgmentFeatureAsyncThunk.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(createAcknowledgmentFeatureStepsAsyncThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createAcknowledgmentFeatureStepsAsyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;

      toast.success('Create acknowledgment feature steps successfully');
    });
    builder.addCase(createAcknowledgmentFeatureStepsAsyncThunk.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { resetAcknowledgment } = acknowledgmentSlides.actions;
export default acknowledgmentSlides.reducer;
