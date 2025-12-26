import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { createAcknowledgmentFeatureAsyncThunk } from './actions/createAcknowledgmentFeatureAsyncThunk';
import { createAcknowledgmentFeatureStepsAsyncThunk } from './actions/createAcknowledgmentFeatureStepsAsyncThunk';
import { getAcknowledgmentAsyncThunk } from './actions/getAcknowledgmentAsyncThunk';
import { getAcknowledgmentFeatureStepsAsyncThunk } from './actions/getAcknowledgmentFeatureStepsAsyncThunk';
import { updateCompleteAcknowledgmentAsyncThunk } from './actions/updateCompleteAcknowledgmentAsyncThunk';
import { initialAcknowledgmentState } from './types';

const acknowledgmentSlides = createSlice({
  name: 'acknowledgment',
  initialState: initialAcknowledgmentState,
  reducers: {
    resetAcknowledgment: () => initialAcknowledgmentState,
    hideAcknowledgment: (state) => {
      state.isVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAcknowledgmentAsyncThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAcknowledgmentAsyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoaded = true;
      state.isVisible = true;
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

    builder.addCase(getAcknowledgmentFeatureStepsAsyncThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAcknowledgmentFeatureStepsAsyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isVisible = true;
      state.data = {
        ...state.data,
        ...action.payload,
      };
    });
    builder.addCase(getAcknowledgmentFeatureStepsAsyncThunk.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateCompleteAcknowledgmentAsyncThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCompleteAcknowledgmentAsyncThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isVisible = false;
      const { [action.payload.featureKey]: _, ...rest } = state.data;
      state.data = rest;

      toast.success('Update complete acknowledgment successfully');
    });
    builder.addCase(updateCompleteAcknowledgmentAsyncThunk.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { resetAcknowledgment, hideAcknowledgment } = acknowledgmentSlides.actions;
export default acknowledgmentSlides.reducer;
