import {createSlice} from "@reduxjs/toolkit";

export interface uiState {
  checked?: number
}

export const initialState: uiState = {
  checked: 0
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedMenuItem: (state: uiState, action) =>
      void(state.checked = action.payload)
  }
})
export const {setSelectedMenuItem} = uiSlice.actions
