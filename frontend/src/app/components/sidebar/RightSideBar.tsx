import React from "react";
import {Sidebar} from "@consta/uikit/Sidebar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {closeSideBar} from "../../features/ui";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {RightSideBarTabs} from "./RightSideBarTabs.tsx";
import {CloseButton} from "../buttons";
import {RightSideBarContent} from "./RightSideBarContent.tsx";
import {setCurrentArticle} from "../../features/article";



export const RightSideBar = () => {
  const isSidebarOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  // const article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  const dispatch = useDispatch()

  const handleCloseSideBar = () => {
    dispatch(closeSideBar())
    dispatch(setCurrentArticle({}))
  }

  return (
    <Theme preset={presetGpnDefault}>
      <Sidebar isOpen={isSidebarOpen} onEsc={handleCloseSideBar} size={'l'} hasOverlay={false}>
        <Sidebar.Content>
          <RightSideBarTabs/>
          <CloseButton callback={handleCloseSideBar}/>
          <RightSideBarContent/>
        </Sidebar.Content>
      </Sidebar>
    </Theme>
  )
}