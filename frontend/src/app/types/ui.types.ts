import {IconComponent} from "@consta/uikit/Icon";

export type RightSideBarTabsItem = {
  key: number;
  label: string;
  icon: IconComponent;
};

export interface uiState {
  timezone:  string,
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
  }
}