import { apiSlice } from '@app/api/api.slice';
import { GetPosts, PostArgs, Posts } from '@postie/shared-types';

export const postApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query<{ posts: Posts[]; hasMore: boolean }, GetPosts>({
      query: ({ cursor, limit }) => ({
        url: `/posts?cursor=${cursor ?? ''}&limit=${limit ?? ''}`,
        method: 'GET',
      }),
      providesTags: ['Post'],
    }),
    createPost: builder.mutation<Posts, PostArgs>({
      query: (body) => ({
        url: '/posts/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postApiSlice;
