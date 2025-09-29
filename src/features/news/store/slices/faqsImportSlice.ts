import { FaqsImportValidationResult } from '@/features/helps-center/domain/entities/models/faqs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ImportStep = 'upload' | 'validation' | 'import' | 'complete';
export type ValidationTab = 'all' | 'valid' | 'invalid';

export interface FaqsImportState {
  step: ImportStep;
  activeTab: ValidationTab;
  selectedFile: File | null;
  validationResult: FaqsImportValidationResult | null;
}

const initialState: FaqsImportState = {
  step: 'upload',
  activeTab: 'all',
  selectedFile: null,
  validationResult: null,
};

const faqsImportSlice = createSlice({
  name: 'faqsImport',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<ImportStep>) => {
      state.step = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<ValidationTab>) => {
      state.activeTab = action.payload;
    },

    setSelectedFile: (state, action: PayloadAction<File>) => {
      state.selectedFile = action.payload;
    },

    setValidationResult: (state, action: PayloadAction<FaqsImportValidationResult>) => {
      state.validationResult = action.payload;
      state.step = 'validation';
      state.activeTab = 'all';
    },

    clearValidationResult: (state) => {
      state.validationResult = null;
    },

    reset: () => initialState,
  },
});

export const {
  setStep,
  setActiveTab,
  setSelectedFile,
  setValidationResult,
  clearValidationResult,
  reset,
} = faqsImportSlice.actions;

export default faqsImportSlice.reducer;
