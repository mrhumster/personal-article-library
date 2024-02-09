import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import {IconComponent} from "@consta/icons/Icon";
import {List} from "@consta/uikit/ListCanary";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconBookmarkStroked} from "@consta/icons/IconBookmarkStroked";
import {IconList} from "@consta/icons/IconList";

import {IconBook, IconClock, IconCopyFile, IconOpenBook, IconStar, IconTrash} from "./Icons.ts";
import {RootState} from "../../store";
import {AddNewCollection} from "./AddNewCollection.tsx";
import {useGetMyCollectionsQuery} from "../../services/backend";
import {CollectionStateIFace} from "../../types";

import {MenuItem} from "./MenuItem.tsx";
import {SkeletonBrick} from "@consta/uikit/Skeleton";

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
  availableForDrop: boolean
};

const items: Item[] = [
  {
    key: '0',
    label: 'Все ссылки',
    leftIcon: IconBook,
    groupId: 1,
    availableForDrop: false,
  },
  {
    key: '1',
    label: 'Недавно добавленные',
    leftIcon: IconClock,
    groupId: 1,
    availableForDrop: false,
  },
  {
    key: '2',
    label: 'Недавно прочитал',
    leftIcon: IconBookmarkStroked,
    groupId: 1,
    availableForDrop: false,
  },
  {
    key: '3',
    label: 'Избранное',
    leftIcon: IconStar,
    groupId: 1,
    availableForDrop: false,
  },
  /*
  {
    key: '4',
    label: 'Мои публикации',
    leftIcon: IconOpenBook,
    groupId: 1,
    availableForDrop: false,
  },
  {
    key: '5',
    label: 'Дубликаты',
    leftIcon: IconCopyFile,
    groupId: 1,
    availableForDrop: false,
  },
   */
  {
    key: '6',
    label: 'Корзина',
    leftIcon: IconTrash,
    groupId: 1,
    availableForDrop: false,
  }
];

export const TabsMenu = () => {
  const {refetch, isLoading, isSuccess} = useGetMyCollectionsQuery({ pollingInterval: 3000 })
  const collections: CollectionStateIFace = useSelector((state: RootState) => state.collections)
  const [itemsWithCollections, setItemsWithCollections] = useState<Item[]>(items)

  useEffect(() => {refetch()}, [])

  useEffect(() => {
    // Создание пунктов меню для Коллекций
    if (collections && isSuccess) {
      const collectionItems: Item[] = []

      collections.ids.map((id: string) => {
        const item: Item = {
          key: id,
          label: collections.entities[id].title,
          groupId: 2,
          leftIcon: IconList,
          availableForDrop: true,
        }
        collectionItems.push(item)
      })
      setItemsWithCollections([...items, ...collectionItems])
    }
  }, [collections.ids, isSuccess])

  const collGroupTitle = <div className={'Text Text_lineHeight_xs Text_size_xs Text_spacing_xs Text_transform_uppercase Text_view_secondary ListGroupLabel ListItemGrid MixSpace MixSpace_pT_m MixSpace_pB_xs MixSpace_mL_s MixSpace_mR_s'}>КОЛЛЕКЦИИ</div>

  return (
    <Theme preset={presetGpnDefault}>
      <div className="ms-0 me-0 mb-5 font-ligh whitespace-nowrap tracking-tighter">
        <List size={'m'} items={itemsWithCollections} groups={groups}
              renderItem={(item) => <MenuItem item={item} refetch={refetch}/>}/>

        {isLoading &&
          <>
            {collGroupTitle}
            <div className={'m-2'}><SkeletonBrick height={25}/></div>
            <div className={'m-2'}><SkeletonBrick height={25}/></div>
          </>
        }
        {collections.ids.length === 0 && collGroupTitle}
        <AddNewCollection/>
      </div>
    </Theme>
  );
}