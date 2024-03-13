import {createSlice} from "@reduxjs/toolkit";
import {FileScheme, uiState} from "../../types";
import {backendApi} from "../../services/backend";
import {HighlightScheme} from "../../types/article.types.ts";

export const initialState: uiState = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reader: {
    isReaderOpen: false,
    activeTab: undefined,
    files: [],
    dictArticleByFile: {},
    showHighlight: undefined,
    searchQueryByFile: {}
  },
  checked: {
    id: '0',
    group: 1
  },
  rightSideBar: {
    activeTab: 0,
    isSidebarOpen: false,
    activeNotebook: undefined,
    additionalInformation: {
      isActiveClickOutside: true
    }
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
  },
  search: {
    showDialog: false
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedMenuItem: (state: uiState, {payload}:{payload: {id: string, group: number}}) => {
      void (state.checked = payload)
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
    openFile: (state: uiState, {payload}:{payload: {file: FileScheme, article_id: string, search_query: string | undefined}}) => {
      const {file, article_id, search_query} = payload
      state.reader.dictArticleByFile[file.id] = article_id
      if (state.reader.files.map(f => f.id).indexOf(file.id) === -1) {
        state.reader.files = [...state.reader.files, file]
      }
      state.reader.activeTab = file
      if (search_query) state.reader.searchQueryByFile[file.id] = search_query
    },
    closeFile: (state: uiState, {payload}:{payload: {id: string}}) => {
      state.reader.files = state.reader.files.filter((file) => file.id !== payload.id)
      delete state.reader.dictArticleByFile[payload.id]
      delete state.reader.searchQueryByFile[payload.id]
      if (state.reader.activeTab?.id === payload.id) {
        state.reader.activeTab = state.reader.files[0]
      }
      if (state.reader.files.length === 0) {
        state.reader.isReaderOpen = false
      }
    },
    setActiveReaderTab: (state: uiState, action) => {
      state.reader.activeTab = action.payload
    },
    setActiveNotebook: (state: uiState, {payload}:{payload: string | undefined}) => {
      state.rightSideBar.activeNotebook = payload
    },
    showHighlight: (state: uiState, {payload}:{payload: HighlightScheme | undefined}) => {
      state.reader.showHighlight = payload
    },
    resetUi: () => {
      return initialState
    },
    openSearchDialog: (state: uiState) => {
      state.search.showDialog = true
    },
    closeSearchDialog: (state: uiState) => {
      state.search.showDialog = false
    },
    setActiveClickOutsideOnAdditionalInformation: (state: uiState, {payload}: {payload: boolean}) => {
      state.rightSideBar.additionalInformation.isActiveClickOutside = payload
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
  setActiveReaderTab,
  resetUi,
  setActiveNotebook,
  showHighlight,
  openSearchDialog,
  closeSearchDialog,
  setActiveClickOutsideOnAdditionalInformation
} = uiSlice.actions
