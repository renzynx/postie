import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/api.slice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';
import authReducer from '@features/auth/auth.slice';
import paginationReducer from '@features/posts/pagination.slice';
import postReducer from '@features/posts/post.slice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    pagination: paginationReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();

setupListeners(store.dispatch);
