import { RootState } from '@app/store';
import { createSlice } from '@reduxjs/toolkit';

interface PaginationState {
  cursor: string | null;
  limit: number;
}

const initialState: PaginationState = { cursor: null, limit: 10 };

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setPagination(state, action) {
      state.cursor = action.payload.cursor;
      state.limit = action.payload.limit;
    },
  },
});

export const { setPagination } = paginationSlice.actions;

export default paginationSlice.reducer;

export const selectPagination = (state: RootState) => state.pagination;
