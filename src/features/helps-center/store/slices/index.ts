import { helpsCenterApi } from '../api/helpsCenterApi';

export const helpsCenterReducers = {
  [helpsCenterApi.reducerPath]: helpsCenterApi.reducer,
};

export const helpsCenterMiddlewares = [helpsCenterApi.middleware];
