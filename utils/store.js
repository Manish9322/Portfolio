import { configureStore } from '@reduxjs/toolkit';
import { portfolioApi } from '../services/api';

export const store = configureStore({
  reducer: {
    [portfolioApi.reducerPath]: portfolioApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(portfolioApi.middleware),
});