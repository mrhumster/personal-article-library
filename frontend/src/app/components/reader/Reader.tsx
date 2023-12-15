import React from "react";
import { Tabs } from '@consta/uikit/Tabs';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveReaderTab} from "../../features/ui";
import {ShowFile} from "./ShowFile.tsx";
import {FileScheme} from "../../types";

export const Reader = () => {
  const files = useSelector((state: RootState) => state.ui.reader.files)
  const active = useSelector((state: RootState) => state.ui.reader.activeTab)
  const isSidebarOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const dispatch = useDispatch()
  const getItemLabel = (file: FileScheme) => {
    return file.file_name ? file.file_name : 'Файл без имени'
  }

  const handleClickTab = ({value}: { value: FileScheme }) => {
    dispatch(setActiveReaderTab(value))
  }

  return (
    <div className={`flex flex-col ${isSidebarOpen ? 'w-5/6' : 'w-full'}`}>
      <Tabs
        value={active}
        getItemLabel={getItemLabel}
        items={files}
        onChange={handleClickTab}
      />
      <ShowFile />
    </div>
  )
}