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
      providesTags: ['Post'],
      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        // get the previous posts
        const { posts: previousPosts } = (getState() as RootState).post;
        const { posts, hasMore } = await (await queryFulfilled).data;

        if (posts.length === 0 && hasMore === false) {
          return;
        }

        dispatch(
          postApiSlice.util.updateQueryData('getPosts', args, (draft) => {
            draft.posts = [...(previousPosts ?? []), ...posts];
          })
        );
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
      onQueryStarted: (_, { dispatch, queryFulfilled, getState }) => {
        queryFulfilled.then((result) => {
          if (result.data) {
            const { cursor, limit } = (getState() as RootState).pagination;
            dispatch(
              postApiSlice.util.updateQueryData(
                'getPosts',
                { cursor, limit },
                (draft) => {
                  draft.posts.unshift(result.data);
                }
              )
            );
          }
        });
      },
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
            const { cursor, limit } = (getState() as RootState).pagination;
            dispatch(
              postApiSlice.util.updateQueryData('findPost', postId, (draft) => {
                if (value === 1) {
                  draft.likes++;
                  draft.dislikes !== 0 && draft.dislikes--;
                } else {
                  draft.likes !== 0 && draft.likes--;
                  draft.dislikes++;
                }
                draft.currentUserVoted = value;
              })
            );
            dispatch(
              postApiSlice.util.updateQueryData(
                'getPosts',
                { cursor, limit },
                (draft) => {
                  const post = draft.posts.find((p) => p.uuid === postId);

                  if (post) {
                    if (value === 1) {
                      post.likes++;
                      post.dislikes !== 0 && post.dislikes--;
                    } else {
                      post.likes !== 0 && post.likes--;
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
