import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ['Post', 'User'],
  endpoints: (_) => ({}),
});
