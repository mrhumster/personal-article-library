import React from "react";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../store";
import {closeLeftSideBar} from "../../features/ui";
import {CloseButton} from "../buttons";

import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {Sidebar} from "@consta/uikit/Sidebar";
import {NewArticleForm} from "../forms";

export const LeftSideBar = ({parent}:{parent: React.RefObject<HTMLDivElement>}) => {
  const isSidebarOpen = useSelector((state: RootState) => state.ui.leftSideBar.isSidebarOpen)
  const dispatch = useDispatch()

  const handleCloseSideBar = () => {
    dispatch(closeLeftSideBar())
  }

  return (
    <Theme preset={presetGpnDefault}>
      <Sidebar container={parent.current ? parent.current : undefined}
               className={'z-20'}
               isOpen={isSidebarOpen}
               onEsc={handleCloseSideBar}
               size={'l'}
               hasOverlay={false}
               position={'left'}>
        <Sidebar.Content>
          <CloseButton callback={handleCloseSideBar}/>
          <NewArticleForm />
        </Sidebar.Content>
      </Sidebar>
    </Theme>
  )
}