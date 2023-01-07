import { apiSlice } from '@app/api/api.slice';
import { Post } from '@prisma/client';
import { GetPosts, PostArgs, Posts } from '@postie/shared-types';

export const postApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query<Posts[], GetPosts>({
      query: ({ cursor, limit }) => ({
        url: `/posts?cursor=${cursor ?? ''}&limit=${limit ?? ''}`,
        method: 'GET',
      }),
    }),
    createPost: builder.mutation<Post, PostArgs>({
      query: (body) => ({
        url: '/posts/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postApiSlice;
