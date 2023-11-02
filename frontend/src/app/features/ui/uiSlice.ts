import {createSlice} from "@reduxjs/toolkit";

export interface uiState {
  checked?: number
  uploadProgress: {
    show: boolean,
    error: boolean,
    success: boolean,
    loading: boolean,
    file: {
      name: string
      extension: string
      description: string
    } | undefined
  }
}

export const initialState: uiState = {
  checked: 0,
  uploadProgress: {
    show: false,
    error: false,
    success: false,
    loading: false,
    file: undefined
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedMenuItem: (state: uiState, action) => {
      void (state.checked = action.payload)
    },
    showUploadProgress: (state: uiState, action) => {
      state.uploadProgress.show = action.payload
    },
    closeUploadProgress: (state: uiState) => {
      state.uploadProgress.show = false
    },
    setFileInProgress: (state: uiState, action) => {
      state.uploadProgress.file = action.payload
    },
    setLoading: (state: uiState, action) => {
      state.uploadProgress.loading = action.payload
    },
    setSuccess: (state: uiState, action) => {
      state.uploadProgress.success = action.payload
    },
    setError: (state: uiState, action) => {
      state.uploadProgress.error = action.payload
    }
  }
})
export const {
  setSelectedMenuItem,
  showUploadProgress,
  closeUploadProgress,
  setFileInProgress,
  setLoading,
  setSuccess,
  setError
} = uiSlice.actions
