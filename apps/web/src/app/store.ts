import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/api.slice';
import authReducer from '@features/auth/auth.slice';
import scrollReducer from '@features/scroll/scroll.slice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    scroll: scrollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);