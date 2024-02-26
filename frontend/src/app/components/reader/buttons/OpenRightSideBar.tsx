import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeSideBar, openSideBar} from "../../../features/ui";
import {RootState} from "../../../store";
import {Icon, MinimalButton, Position, Tooltip} from "@react-pdf-viewer/core";

export const OpenRightSideBar = () => {
  const dispatch = useDispatch()
  const article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)

  const clickHandler = () => {
    if (isOpen) {
      dispatch(closeSideBar())
    } else {
      dispatch(openSideBar(article))
    }
  }

  return (
    <Tooltip
        position={Position.BottomLeft}
        target={
          <MinimalButton
            onClick={clickHandler}
            ariaLabel="Toggle the bookmarks"
            isSelected={isOpen}>
            <Icon size={16}>
              <rect x="0.5" y="0.497" width="22" height="22" rx="1" ry="1"/>
              <line x1="15.5" y1="0.497" x2="15.5" y2="22.497"/>
            </Icon>
          </MinimalButton>
        }
        content={() => <div style={{width: '150px'}}>Правая панель</div>}
        offset={{left: 5, top: 10}}
    >
    </Tooltip>
  )
}