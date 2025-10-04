import { Notification } from '@/shared/types';

export interface EmailState {
  isModalOpen: boolean;
  sendTo: string;
  recipients: string[];
  subject: string;
  selectedTemplate: Notification | null;
  templates: {
    isLoading: boolean;
    data: Array<Notification>;
    error: string | null;
  };
}

export const initialState: EmailState = {
  isModalOpen: false,
  sendTo: '',
  recipients: [],
  subject: '',
  selectedTemplate: null,
  templates: {
    isLoading: false,
    data: [],
    error: null,
  },
};
