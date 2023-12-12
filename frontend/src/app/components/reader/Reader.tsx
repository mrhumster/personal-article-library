import React from "react";
import { Tabs } from '@consta/uikit/Tabs';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveReaderTab} from "../../features/ui";

export const Reader = () => {
  const files = useSelector((state: RootState) => state.ui.reader.files)
  const active = useSelector((state: RootState) => state.ui.reader.activeTab)
  const dispatch = useDispatch()
  const getItemLabel = (label: string) => label
  const handleClickTab = ({ value }:{value: string}) => {
    console.log(value)
    dispatch(setActiveReaderTab(value))
  }

  return (
    <Tabs
      value={active}
      getItemLabel={getItemLabel}
      items={files}
      onChange={handleClickTab}
    />
  )
}