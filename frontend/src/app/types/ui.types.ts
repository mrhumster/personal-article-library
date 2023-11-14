import {IconComponent} from "@consta/uikit/Icon";

export type RightSideBarTabsItem = {
  key: number;
  label: string;
  image: IconComponent;
};

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
  },
  dragndrop: {
    activeAllReferenceDragNDropField: boolean
  }
}