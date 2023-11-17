import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/uikit/IconKebab";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {Item} from "./TabsMenu.tsx";
import {setSelectedMenuItem} from "../../features/ui";
import {useUpdateMyCollectionMutation} from "../../services/backend";
import {CollectionStateIFace} from "../../types";

interface MenuItemPropsIFace {
  item: Item
  refetch: any
}

export const MenuItem = (props: MenuItemPropsIFace) => {
  const {item, refetch} = props
  const {isActive, kind} = useSelector((state: RootState) => state.ui.dragndrop)
  const checked = useSelector((state: RootState) => state.ui.checked.id)
  const collections: CollectionStateIFace = useSelector((state: RootState) => state.collections)
  const [updateMyCollection,  data] = useUpdateMyCollectionMutation()
  const dispatch = useDispatch()

  const handleItemClick = (item: Item) => dispatch(setSelectedMenuItem({id: item.key, group: item.groupId}))

  const handleOnDragOver = (event: React.DragEvent) => event.preventDefault()

  const handleOnDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const article_id = event.dataTransfer.getData("article_id");
    const collection_id = event.currentTarget.id
    const articles = collections.entities[collection_id].articles
    updateMyCollection({collection_id: collection_id, articles: [...articles, article_id]})
  }

  useEffect(() => {if (data.isSuccess && !data.isError) refetch()}, [data.isSuccess, data.isError])

  return (
              <div className={`
                ${item.key === checked ? 'border-s-2 border-sky-600' : ''} 
                ${isActive && kind === 'string' && item.availableForDrop && 'border-sky-500 border rounded'} 
                cursor-pointer my-1 flex items-center align-center
              `}
                 onClick={() => handleItemClick(item)}
                 onDrop={handleOnDrop}
                 onDragOver={handleOnDragOver}
                 id={item.key}
              >
                {item.leftIcon && <item.leftIcon size={'s'} className={'m-2'}/>}<span
                className={'grow'}>{item.label}</span>
                {item.groupId === 2 ? <Button view={'clear'} size={'s'} iconLeft={IconKebab} onlyIcon/> : <></>}
              </div>
            )
}