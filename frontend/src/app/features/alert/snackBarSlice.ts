import {createSlice} from "@reduxjs/toolkit";
import {SnackBarItemStatus} from "@consta/uikit/SnackBar";

export type Item = {
  key?: number;
  message: string;
  status: SnackBarItemStatus;
  progressMode?: 'line' | 'timer';
  criticality?: number
};

const initialState: Item[] = []

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    'addMessage': (state: Item[], action) => {
      action.payload.key = state.length + 1
      return [...state, action.payload]
    },
    'removeMessage': (state: Item[], action) =>
      state.filter((item) => item.key !== action.payload.key)
  }
})

export const {addMessage, removeMessage} = snackBarSlice.actions