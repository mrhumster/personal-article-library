import React from "react";
import { Tabs } from '@consta/uikit/Tabs';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveReaderTab} from "../../features/ui";
import {ShowFile} from "./ShowFile.tsx";
import {FileScheme} from "../../types";
import {IconDocFilled} from "@consta/uikit/IconDocFilled";
import {Button} from "@consta/uikit/Button";
import {IconClose} from "@consta/uikit/IconClose";
import {IconRestart} from "@consta/uikit/IconRestart";
import {closeFile} from "../../features/ui/uiSlice.ts";

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

  const getItemIcon = () => IconDocFilled

  const handleClickCloseFile = ({ item }:{item: FileScheme}) => {
    console.log(item)
  }

  const getItemRightSide = ({ item }:{item: FileScheme}) =>
      <Button
        tabIndex={0}
        as="span"
        label="Rerun"
        iconLeft={IconClose}
        form="round"
        view="clear"
        size="xs"
        onlyIcon
        onClick={() => {console.log(item)}}
      />

  return (
    <div className={`flex flex-col ${isSidebarOpen ? 'w-5/6' : 'w-full'}`}>
      <Tabs
        className="ps-2"
        value={active}
        getItemLabel={getItemLabel}
        items={files}
        onChange={handleClickTab}
        getItemLeftIcon={getItemIcon}
        getItemRightSide={getItemRightSide}
      />
      <ShowFile />
    </div>
  )
}