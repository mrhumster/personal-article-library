import React, {useEffect, useState} from "react";
import {IconComponent} from "@consta/uikit/Icon";
import {List} from "@consta/uikit/ListCanary";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconBookmarkStroked} from "@consta/uikit/IconBookmarkStroked";
import {IconBook, IconClock, IconCopyFile, IconOpenBook, IconStar, IconTrash} from "./Icons.ts";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedMenuItem} from "../../features/ui";
import {RootState} from "../../store";
import {AddNewCollection} from "./AddNewCollection.tsx";
import {useGetMyCollectionsQuery} from "../../services/backend";
import {Loader} from "@consta/uikit/Loader";
import {CollectionStateIFace} from "../../types";
import {IconList} from "@consta/uikit/IconList";

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
  key?: string;
  label: string;
  leftIcon?: IconComponent;
  leftRight?: IconComponent;
  rightSide?: React.ReactNode;
  groupId?: number,
};

const items: Item[] = [
  {
    key: '0',
    label: 'Все ссылки',
    leftIcon: IconBook,
    groupId: 1,
  },
  {
    key: '1',
    label: 'Недавно добавленные',
    leftIcon: IconClock,
    groupId: 1,
  },
  {
    key: '2',
    label: 'Недавно прочитал',
    leftIcon: IconBookmarkStroked,
    groupId: 1,
  },
  {
    key: '3',
    label: 'Избранное',
    leftIcon: IconStar,
    groupId: 1,
  },
  {
    key: '4',
    label: 'Мои публикации',
    leftIcon: IconOpenBook,
    groupId: 1,
  },
  {
    key: '5',
    label: 'Дубликаты',
    leftIcon: IconCopyFile,
    groupId: 1,
  },
  {
    key: '6',
    label: 'Корзина',
    leftIcon: IconTrash,
    groupId: 1,
  }
];

export const TabsMenu = () => {
  const dispatch = useDispatch()
  const checked = useSelector((state: RootState) => state.ui.checked.id)
  const handleItemClick = (item: Item) => dispatch(setSelectedMenuItem({id: item.key, group: item.groupId}))
  const { isLoading, isSuccess } = useGetMyCollectionsQuery({pollingInterval: 3000})
  const collections: CollectionStateIFace = useSelector((state: RootState) => state.collections)
  const [itemsWithCollections, setItemsWithCollections] = useState<Item[]>(items)

  useEffect(() => {
    if (collections && isSuccess) {
      const collectionItems: Item[] = []
      collections.ids.map((id: string) => {
        const item: Item = {
          key: id,
          label: collections.entities[id].title,
          groupId: 2,
          leftIcon: IconList
        }
        collectionItems.push(item)
      })
      setItemsWithCollections([...items, ...collectionItems])
    }
  }, [collections.ids, isSuccess])

  return (
    <Theme preset={presetGpnDefault}>
      <div className="ms-0 me-0 font-light  whitespace-nowrap select-none tracking-tighter">
        <List
          size={'m'}
          items={itemsWithCollections}
          getItemChecked={(item) => checked === item.key}
          onItemClick={(item) => handleItemClick(item)}
          innerOffset={'increased'}
          groups={groups}
        />
        {isLoading && <Loader className={'m-3'} size="s" />}
        <AddNewCollection />
      </div>
    </Theme>
  );
}