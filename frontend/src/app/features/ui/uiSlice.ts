import {createSlice} from "@reduxjs/toolkit";

export interface uiState {
  checked?: number,
  rightSideBar: {
    isSidebarOpen: boolean
    article?: {
      id: string
    }
    activeTab: number
  }
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
  rightSideBar: {
    activeTab: 0,
    isSidebarOpen: false,
  },
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
    },
    openSideBar: (state: uiState, action) => {
      state.rightSideBar.isSidebarOpen = true
      state.rightSideBar.article = action.payload
    },
    closeSideBar: (state: uiState) => {
      state.rightSideBar.isSidebarOpen = false
      state.rightSideBar.article = undefined
    },
    setActiveTab: (state: uiState, action) => {
      state.rightSideBar.activeTab = action.payload
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
  setError,
  openSideBar,
  closeSideBar,
  setActiveTab
} = uiSlice.actions
