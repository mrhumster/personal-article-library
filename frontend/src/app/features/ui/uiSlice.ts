import {createSlice} from "@reduxjs/toolkit";
import {uiState} from "../../types";
import {backendApi} from "../../services/backend";

export const initialState: uiState = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reader: {
    isReaderOpen: false,
    activeTab: undefined,
    files: []
  },
  checked: {
    id: '0',
    group: 1
  },
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
    isActive: false,
    kind: undefined,
    type: undefined,
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
    setDragEvent: (state: uiState, action) => {
      const {isActive, kind, type} = action.payload
      state.dragndrop.isActive = isActive
      state.dragndrop.kind = kind
      state.dragndrop.type = type
    },
    openReader: (state: uiState) => {
      state.reader.isReaderOpen = true
    },
    closeReader: (state: uiState) => {
      state.reader.isReaderOpen = false
    },
    openFile: (state: uiState, action) => {
      if (state.reader.files.indexOf(action.payload) === -1) {
        state.reader.files = [...state.reader.files, action.payload]
      }
      state.reader.activeTab = action.payload
    },
    closeFile: (state: uiState, action) => {
      state.reader.files = state.reader.files.filter((id) => id !== action.payload)
    },
    setActiveReaderTab: (state: uiState, action) => {
      state.reader.activeTab = action.payload
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
  setDragEvent,
  openReader,
  closeReader,
  openFile,
  closeFile,
  setActiveReaderTab
} = uiSlice.actions
