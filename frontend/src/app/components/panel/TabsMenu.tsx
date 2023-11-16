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
import {useGetMyCollectionsQuery, useUpdateMyCollectionMutation} from "../../services/backend";
import {Loader} from "@consta/uikit/Loader";
import {CollectionStateIFace} from "../../types";
import {IconList} from "@consta/uikit/IconList";
import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/uikit/IconKebab";

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
  {
    key: '6',
    label: 'Корзина',
    leftIcon: IconTrash,
    groupId: 1,
    availableForDrop: false,
  }
];

export const TabsMenu = () => {
  const dispatch = useDispatch()
  const checked = useSelector((state: RootState) => state.ui.checked.id)
  const handleItemClick = (item: Item) => dispatch(setSelectedMenuItem({id: item.key, group: item.groupId}))
  const {refetch, isLoading, isSuccess } = useGetMyCollectionsQuery({pollingInterval: 3000})
  const collections: CollectionStateIFace = useSelector((state: RootState) => state.collections)
  const [itemsWithCollections, setItemsWithCollections] = useState<Item[]>(items)
  const visible = useSelector((state: RootState) => state.ui.dragndrop.activeAllReferenceDragNDropField)
  const [updateMyCollection] = useUpdateMyCollectionMutation()

  const handleOnDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("article_id");
    const collection = event.currentTarget.id
    const articles = collections.entities[collection].articles
    updateMyCollection({collection_id: collection, articles: [...articles, data]})
    refetch()
  }


  const handleOnDragOver = (event) => {
    // console.log(event)
  }

  useEffect(() => {
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

  return (
    <Theme preset={presetGpnDefault}>
      <div className="ms-0 me-0 font-light  whitespace-nowrap select-none tracking-tighter">
        <List
          size={'m'}
          items={itemsWithCollections}
          groups={groups}
          renderItem={(item) => {

            return (
              <div className={`${item.key === checked ? 'border-s-2 border-sky-600' : ''} ${visible && item.availableForDrop && 'border-sky-500 border rounded'} cursor-pointer my-1 flex items-center align-center`}
                onClick={() => handleItemClick(item)}
                onDrop={handleOnDrop}
                onDragOver={handleOnDragOver}
                id={item.key}
              >
                {item.leftIcon && <item.leftIcon size={'s'} className={'m-2'} />}<span className={'grow'}>{item.label}</span>
                {item.groupId === 2 ? <Button view={'clear'} size={'s'} iconLeft={IconKebab} onlyIcon /> : <></>}
              </div>
            )
          }}
        />
        {isLoading && <Loader className={'m-3'} size="s" />}
        <AddNewCollection />
      </div>
    </Theme>
  );
}