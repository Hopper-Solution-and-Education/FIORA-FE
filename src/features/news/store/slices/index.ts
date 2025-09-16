import { newsApi } from '../api/newsApi';

export const helpsCenterReducers = {
  [newsApi.reducerPath]: newsApi.reducer,
};

export const helpsCenterMiddlewares = [newsApi.middleware];
