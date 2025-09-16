import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface EmailState {
  isModalOpen: boolean;
  sendTo: string;
  recipients: string[];
  subject: string;
  selectedTemplate: string;
  templateContent: string;
  templateName: string;
  templateType: string;
}

const initialState: EmailState = {
  isModalOpen: false,
  sendTo: 'cs',
  recipients: ['hopper.future@gmail.com'],
  subject: 'Hướng dẫn quy khách hàng thực hiện thao tác KYC',
  selectedTemplate: 'account-verification',
  templateContent: '',
  templateName: 'Account Verification',
  templateType: 'Deposit',
};

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
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    setRecipients: (state, action: PayloadAction<string[]>) => {
      state.recipients = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplate = action.payload;
    },
    setTemplateName: (state, action: PayloadAction<string>) => {
      state.templateName = action.payload;
    },
    setTemplateType: (state, action: PayloadAction<string>) => {
      state.templateType = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  setSendTo,
  setSubject,
  setRecipients,
  setSelectedTemplate,
  setTemplateName,
  setTemplateType,
} = emailSlice.actions;

export default emailSlice.reducer;
