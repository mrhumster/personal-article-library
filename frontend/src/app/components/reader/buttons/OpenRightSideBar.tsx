import React from "react";
import {Button} from "@consta/uikit/Button";
import {IconInfo} from "@consta/icons/IconInfo"
import {useDispatch, useSelector} from "react-redux";
import {closeSideBar, openSideBar} from "../../../features/ui";
import {RootState} from "../../../store";

export const OpenRightSideBar = () => {
  const dispatch = useDispatch()
  const article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)

  const clickHandler = () => {
    if (isOpen) {
      dispatch(closeSideBar())
    } else {
      if (article) dispatch(openSideBar(article))
    }
  }

  return (
    <Button
      size='s'
      view='clear'
      onlyIcon
      iconLeft={IconInfo}
      onClick={clickHandler}
    />
  )
}