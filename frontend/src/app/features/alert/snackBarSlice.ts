import {createSlice} from "@reduxjs/toolkit";
import {SnackBarItemDefault, SnackBarItemStatus} from "@consta/uikit/SnackBar";

export type Item = {
  key?: number;
  message: string;
  status: SnackBarItemStatus;
  progressMode?: 'line' | 'timer';
  criticality?: number
};

const initialState: SnackBarItemDefault[] = []

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    'addMessage': (state: SnackBarItemDefault[], action) => {
      action.payload.key = state.length + 1
      return [...state, action.payload]
    },
    'removeMessage': (state: SnackBarItemDefault[], action) =>
      state.filter((item) => item.key !== action.payload.key)
  }
})

export const {
  addMessage,
  removeMessage
} = snackBarSlice.actions