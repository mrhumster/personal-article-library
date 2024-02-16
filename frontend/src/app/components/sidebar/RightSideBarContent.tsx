import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {ArticleDetail} from "../article";
import {Notes} from "../notes";
import {Text} from '@consta/uikit/Text'

export const RightSideBarContent = () => {
  const selectedTab = useSelector((state: RootState) => state.ui.rightSideBar.activeTab)
  switch (selectedTab) {
    case 0:
      return <ArticleDetail />
    case 1:
      return <Text>Annotation</Text>
    case 2:
      return <Notes />
  }
}