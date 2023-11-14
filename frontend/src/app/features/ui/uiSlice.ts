import {createSlice} from "@reduxjs/toolkit";
import {uiState} from "../../types";
import {backendApi} from "../../services/backend";

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
  },
  dragndrop: {
    activeAllReferenceDragNDropField: false
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
    },
    setActiveAllReferenceDragNDropField: (state: uiState, action) => {
      state.dragndrop.activeAllReferenceDragNDropField = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      backendApi.endpoints.getArticle.matchFulfilled,
      (state: uiState, action) => {
        if (!action.payload) {
          state.rightSideBar.isSidebarOpen = false
        }
      }
    )
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
  setActiveTab,
  setActiveAllReferenceDragNDropField
} = uiSlice.actions
