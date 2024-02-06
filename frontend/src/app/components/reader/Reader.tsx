import React from "react";
import { Tabs } from '@consta/uikit/Tabs';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveReaderTab} from "../../features/ui";
import {FileScheme} from "../../types";
import {IconDocFilled} from "@consta/icons/IconDocFilled";
import {Button} from "@consta/uikit/Button";
import {IconClose} from "@consta/icons/IconClose";
import {closeFile} from "../../features/ui/uiSlice.ts";
import {PDFViewer} from "./PDFViewer.tsx";
import {truncateString} from "../../utils";


export const Reader = () => {
  const files = useSelector((state: RootState) => state.ui.reader.files)
  const active = useSelector((state: RootState) => state.ui.reader.activeTab)
  const isSidebarOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const dispatch = useDispatch()
  const getItemLabel = (file: FileScheme) => {
    return file.file_name ? truncateString(file.file_name, 30) : 'Файл без имени'
  }

  const handleClickTab = ( value: FileScheme ) => {
    dispatch(setActiveReaderTab(value))
  }

  const getItemIcon = () => IconDocFilled


  const getItemRightSide = (item: FileScheme) =>
      <Button
        tabIndex={0}
        as="span"
        label="Rerun"
        iconLeft={IconClose}
        form="round"
        view="clear"
        size="xs"
        onlyIcon
        onClick={() => {dispatch(closeFile(item))}}
      />

  return (
    <div className={`flex flex-col ${isSidebarOpen ? 'cropped' : 'w-full'}`}>
      <Tabs
        size={'xs'}
        view={'clear'}
        fitMode={'scroll'}
        className="ps-2"
        value={active}
        getItemLabel={getItemLabel}
        items={files}
        onChange={handleClickTab}
        getItemLeftIcon={getItemIcon}
        getItemRightSide={getItemRightSide}
      />
      <PDFViewer />
    </div>
  )
}