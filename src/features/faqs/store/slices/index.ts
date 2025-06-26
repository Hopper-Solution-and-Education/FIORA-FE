import { faqsApi } from '../api/faqsApi';

export const faqsReducers = {
  [faqsApi.reducerPath]: faqsApi.reducer,
};

export const faqsMiddlewares = [faqsApi.middleware];
