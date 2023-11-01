import React from "react";
import {IconComponent} from "@consta/uikit/Icon";
import {List} from "@consta/uikit/ListCanary";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconBookmarkStroked} from "@consta/uikit/IconBookmarkStroked";
import {IconBook, IconClock, IconCopyFile, IconOpenBook, IconStar, IconTrash} from "./Icons.ts";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedMenuItem} from "../../features/ui/uiSlice.ts";
import {RootState} from "../../store";
import {collectionsMenuItemButton} from "./collectionsMenuItemButton.tsx";
import {AddNewCollection} from "./AddNewCollection.tsx";

type Group = {
  label: string;
  id: number;
  rightSide?: React.ReactNode;
};

const groups: Group[] = [
  {
    id: 1,
    label: '',
  },
  {
    id: 2,
    label: 'Коллекции',
  },
  {
    id: 3,
    label: 'Третья группа',
  },
];

export type Item = {
  key?: number;
  label: string;
  leftIcon?: IconComponent;
  leftRight?: IconComponent;
  groupId?: number,
};

const items: Item[] = [
  {
    key: 0,
    label: 'Все ссылки',
    leftIcon: IconBook,
    groupId: 1,
  },
  {
    key: 1,
    label: 'Недавно добавленные',
    leftIcon: IconClock,
    groupId: 1,
  },
  {
    key: 2,
    label: 'Недавно прочитал',
    leftIcon: IconBookmarkStroked,
    groupId: 1,
  },
  {
    key: 3,
    label: 'Избранное',
    leftIcon: IconStar,
    groupId: 1,
  },
  {
    key: 4,
    label: 'Мои публикации',
    leftIcon: IconOpenBook,
    groupId: 1,
  },
  {
    key: 5,
    label: 'Дубликаты',
    leftIcon: IconCopyFile,
    groupId: 1,
  },
  {
    key: 6,
    label: 'Корзина',
    leftIcon: IconTrash,
    groupId: 1,
  },
  {
    key: 7,
    label: 'Моя коллекция',
    groupId: 2,
  },
];

export const TabsMenu = () => {
  const dispatch = useDispatch()
  const checked = useSelector((state: RootState) => state.ui.checked)
  const handleItemClick = (item: Item) => {
    dispatch(setSelectedMenuItem(item.key))
  }
  return (
    <Theme preset={presetGpnDefault}>
      <div className="ms-0 me-0 font-light  whitespace-nowrap select-none tracking-tighter">
        <List
          size={'m'}
          items={items}
          getItemChecked={(item) => checked === item.key}
          onItemClick={(item) => handleItemClick(item)}
          getItemRightSide={(item) => (collectionsMenuItemButton(item))}
          innerOffset={'increased'}
          groups={groups}
        />
        <AddNewCollection />
      </div>
    </Theme>
  );
}