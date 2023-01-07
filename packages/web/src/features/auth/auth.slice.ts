import { RootState } from '@app/store';
import { SessionUser } from '@postie/shared-types';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  access_token: string | null;
  user?: SessionUser;
}

const initialState: AuthState = { access_token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.access_token = action.payload;
    },
    logOut: (state) => {
      state.access_token = null;
      if (state.user) delete state.user;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, setUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectToken = (state: RootState) => state.auth.access_token;
export const selectUser = (state: RootState) => state.auth.user;
