import { RootState } from '@app/store';
import { Posts } from '@postie/shared-types';
import { createSlice } from '@reduxjs/toolkit';

interface PostState {
  posts: Posts[] | null;
}

const initialState: PostState = {
  posts: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setPost } = postSlice.actions;

export default postSlice.reducer;

export const selectPost = (state: RootState) => state.post;
