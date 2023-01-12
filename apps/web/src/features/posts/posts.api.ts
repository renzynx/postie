import { apiSlice } from '@app/api/api.slice';
import { RootState } from '@app/store';
import { GetPosts, PostArgs, Posts } from '@postie/shared-types';

export const postApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query<{ posts: Posts[]; hasMore: boolean }, GetPosts>({
      query: ({ cursor, limit }) => ({
        url: `/posts?cursor=${cursor ?? ''}&limit=${limit ?? ''}`,
        method: 'GET',
      }),
      merge: (existing, incoming) => {
        return {
          posts: [...(existing?.posts ?? []), ...incoming.posts],
          hasMore: incoming.hasMore,
        };
      },
    }),
    findPost: builder.query<Posts, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'GET',
      }),
    }),
    createPost: builder.mutation<Posts, PostArgs>({
      query: (body) => ({
        url: '/posts/create',
        method: 'POST',
        body,
      }),
    }),
    votePost: builder.mutation<boolean, { postId: string; value: number }>({
      query: (body) => ({
        url: '/posts/vote',
        method: 'POST',
        body,
      }),
      // update the post in the cache
      onQueryStarted: (
        { postId, value },
        { dispatch, queryFulfilled, getState }
      ) => {
        queryFulfilled.then((result) => {
          if (result.data) {
            const { pagination } = getState() as RootState;
            dispatch(
              postApiSlice.util.updateQueryData('findPost', postId, (draft) => {
                if (value === 1) {
                  draft.likes++;
                  draft.dislikes--;
                } else {
                  draft.likes--;
                  draft.dislikes++;
                }
                draft.currentUserVoted = value;
              })
            );
            dispatch(
              postApiSlice.util.updateQueryData(
                'getPosts',
                pagination,
                (draft) => {
                  const post = draft.posts.find((p) => p.id === postId);
                  if (post) {
                    if (value === 1) {
                      post.likes++;
                      post.dislikes--;
                    } else {
                      post.likes--;
                      post.dislikes++;
                    }
                    post.currentUserVoted = value;
                  }
                }
              )
            );
          }
        });
      },
    }),
  }),
});

export const {
  useFindPostQuery,
  useGetPostsQuery,
  useCreatePostMutation,
  useVotePostMutation,
  util: { getRunningQueriesThunk },
} = postApiSlice;
