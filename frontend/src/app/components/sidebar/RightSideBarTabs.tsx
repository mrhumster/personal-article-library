import React from "react";
import { IconDocFilled } from "@consta/icons/IconDocFilled";
import {IconCommentFilled} from "@consta/icons/IconCommentFilled";
import {IconInfo} from "@consta/icons/IconInfo";
import {RightSideBarTabsItem} from "../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveTab} from "../../features/ui";
import {BookmarkTabs} from "@consta/uikit/BookmarkTabs";


const items: RightSideBarTabsItem[] = [
  {
    key: 0,
    label: 'Инфо',
    leftIcon: IconInfo,
  },
  {
    key: 1,
    label: 'Аннотации',
    leftIcon: IconCommentFilled,
  },
  {
    key: 2,
    label: 'Блокнот',
    leftIcon: IconDocFilled,
  },
];


export const RightSideBarTabs = () => {
  const selectedTab = useSelector((state: RootState) => state.ui.rightSideBar.activeTab)
  const dispatch = useDispatch()
  const handleTabClick = (value: RightSideBarTabsItem) => {
    dispatch(setActiveTab(value.key))
  }
  return (
    <div className=''>
      <BookmarkTabs
        value={items[selectedTab]}
        size='s'
        onChange={handleTabClick}
        items={items}
        view={'clear'}
      />
    </div>
  )
}