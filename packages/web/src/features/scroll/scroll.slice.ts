import { RootState } from '@app/store';
import { createSlice } from '@reduxjs/toolkit';

interface ScrollState {
  bottom: boolean;
}

const initialState: ScrollState = {
  bottom: false,
};

const scrollSlice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    setBottom: (state, action) => {
      state.bottom = action.payload;
    },
  },
});

export const { setBottom } = scrollSlice.actions;

export default scrollSlice.reducer;

export const selectBottom = (state: RootState) => state.scroll.bottom;
