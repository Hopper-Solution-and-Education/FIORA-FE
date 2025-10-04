import { Notification } from '@/shared/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchEmailTemplates } from './actions';
import { initialState } from './types';

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    setSendTo: (state, action: PayloadAction<string>) => {
      state.sendTo = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<Notification>) => {
      state.selectedTemplate = action.payload;
    },
    setTemplates: (state, action: PayloadAction<Array<Notification>>) => {
      state.templates.data = action.payload;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    setRecipients: (state, action: PayloadAction<string[]>) => {
      state.recipients = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailTemplates.pending, (state) => {
        state.templates.isLoading = true;
      })
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
        state.templates.isLoading = false;
        state.templates.data = action.payload.data;
      })
      .addCase(fetchEmailTemplates.rejected, (state) => {
        state.templates.isLoading = false;
      });
  },
});

export const {
  openModal,
  closeModal,
  setSendTo,
  setSelectedTemplate,
  setTemplates,
  setSubject,
  setRecipients,
} = emailSlice.actions;

export default emailSlice.reducer;
