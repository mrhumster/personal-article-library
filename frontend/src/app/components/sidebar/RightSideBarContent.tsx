import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {ArticleDetail} from "../article";

export const RightSideBarContent = () => {
  const selectedTab = useSelector((state: RootState) => state.ui.rightSideBar.activeTab)
  switch (selectedTab) {
    case 0:
      return <ArticleDetail />
    case 1:
      return <div>Annotation</div>
    case 2:
      return <div>Notes</div>
  }
}