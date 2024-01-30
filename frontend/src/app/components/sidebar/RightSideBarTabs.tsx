import React from "react";
import {Tabs} from "@consta/uikit/Tabs";
import { IconDocFilled } from "@consta/icons/IconDocFilled";
import {IconCommentFilled} from "@consta/icons/IconCommentFilled";
import {IconInfo} from "@consta/icons/IconInfo";
import {RightSideBarTabsItem} from "../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveTab} from "../../features/ui";


const items: RightSideBarTabsItem[] = [
  {
    key: 0,
    label: 'Инфо',
    icon: IconInfo,
  },
  {
    key: 1,
    label: 'Аннотации',
    icon: IconCommentFilled,
  },
  {
    key: 2,
    label: 'Блокнот',
    icon: IconDocFilled,
  },
];


export const RightSideBarTabs = () => {
  const selectedTab = useSelector((state: RootState) => state.ui.rightSideBar.activeTab)
  const dispatch = useDispatch()
  const handleTabClick = (value: RightSideBarTabsItem) => {
    dispatch(setActiveTab(value.key))
  }
  return (
    <div className='px-2'>
      <Tabs value={items[selectedTab]}
            className={'mt-2'}
            onChange={handleTabClick}
            items={items}
            view={"bordered"}/>
    </div>
  )
}