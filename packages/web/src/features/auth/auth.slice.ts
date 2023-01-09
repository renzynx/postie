import { RootState } from '@app/store';
import { SessionUser } from '@postie/shared-types';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user?: SessionUser;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
