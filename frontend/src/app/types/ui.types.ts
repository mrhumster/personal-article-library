import {IconComponent} from "@consta/icons/Icon";
import {FileScheme, HighlightScheme} from "./article.types.ts";

export type RightSideBarTabsItem = {
  key: number;
  label: string;
  leftIcon: IconComponent;
};

export interface uiState {
  timezone:  string,
  reader: {
    isReaderOpen: boolean
    activeTab?: FileScheme
    files: FileScheme[],
    dictArticleByFile: {
      [key: string]: string
    },
    searchQueryByFile: {
      [key: string]: string
    }
    showHighlight?: HighlightScheme
  },
  checked: {
    id: string,
    group: number
  },
  rightSideBar: {
    isSidebarOpen: boolean
    article?: {
      id: string
    }
    activeTab: number
    activeNotebook?: string
    additionalInformation: {
      isActiveClickOutside: boolean
    }
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
  },
  dragndrop: {
    isActive: boolean
    type?: string
    kind?: string
  },
  search: {
    showDialog: boolean
  }
}