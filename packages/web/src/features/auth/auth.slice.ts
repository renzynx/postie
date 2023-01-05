import { RootState } from '@app/store';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  access_token: string | null;
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
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectToken = (state: RootState) => state.auth.access_token;
