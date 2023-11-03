import React from "react";
import {Tabs} from "@consta/uikit/Tabs";
import { IconDocFilled } from "@consta/uikit/IconDocFilled";
import {IconCommentFilled} from "@consta/uikit/IconComment";
import {IconInfo} from "@consta/uikit/IconInfo";
import {RightSideBarTabsItem} from "../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setActiveTab} from "../../features/ui";


const items: RightSideBarTabsItem[] = [
  {
    key: 0,
    label: 'Инфо',
    image: IconInfo,
  },
  {
    key: 1,
    label: 'Аннотации',
    image: IconCommentFilled,
  },
  {
    key: 2,
    label: 'Блокнот',
    image: IconDocFilled,
  },
];

const getItemIcon = (item: RightSideBarTabsItem) => item.image;

export const RightSideBarTabs = () => {
  const selectedTab = useSelector((state: RootState) => state.ui.rightSideBar.activeTab)
  const dispatch = useDispatch()
  const handleTabClick = (value: RightSideBarTabsItem) => {
    console.log(value)
    dispatch(setActiveTab(value.key))
  }
  return (
    <div className='mt-3 px-3'>
      <Tabs value={items[selectedTab]}
            onChange={({ value}) => handleTabClick(value)}
            items={items}
            view="bordered"
            getItemLeftIcon={getItemIcon}/>
    </div>
  )
}