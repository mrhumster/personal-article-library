import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/icons/IconKebab";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {Item} from "./TabsMenu.tsx";
import {setSelectedMenuItem} from "../../features/ui";
import {
  useDeleteArticleMutation,
  useDeleteMyCollectionMutation, useUpdateArticleMutation,
  useUpdateMyCollectionMutation
} from "../../services/backend";
import {CollectionStateIFace} from "../../types";
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {ProgressSpin} from "@consta/uikit/ProgressSpin";
import {addMessage} from "../../features/alert";
import {TextField} from "@consta/uikit/TextField";

interface MenuItemPropsIFace {
  item: Item
  refetch: () => void
}

export const MenuItem = (props: MenuItemPropsIFace) => {
  const {item, refetch} = props
  const Icon = item.leftIcon
  const {isActive, kind} = useSelector((state: RootState) => state.ui.dragndrop)
  const checked = useSelector((state: RootState) => state.ui.checked.id)
  const collections: CollectionStateIFace = useSelector((state: RootState) => state.collections)
  const [updateMyCollection, data] = useUpdateMyCollectionMutation()
  const [deleteMyCollection] = useDeleteMyCollectionMutation()
  const [openRenameField, setOpenRenameField] = useState<boolean>(false)
  const [changeCollectionName, setChangeCollectionName] = useState<string | null>(null)
  const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [dragOver, setDragOver] = useState<boolean>(false)
  const all_article = useSelector((state: RootState) => state.articles.articles)
  const [ deleteArticle, deleteArticleResult] = useDeleteArticleMutation()
  const [ updateArticle, updateArticleResult ] = useUpdateArticleMutation()

  const dispatch = useDispatch()

  const kebabRef = useRef<HTMLButtonElement>(null)

  const handleItemClick = (item: Item) => dispatch(setSelectedMenuItem({id: item.key, group: item.groupId}))

  const handleOnDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true)
  }

  const handleOnDragLeave =(event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }


  const handleOnDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const article_id = event.dataTransfer.getData("article_id");
    const collection_id = event.currentTarget.id

    if (collection_id === '6') {
      deleteArticle(article_id)
    } else if (collection_id === '3') {
      const article = all_article.entities[article_id]
      updateArticle({...article, favorite: true})
    } else {
      const articles = collections.entities[collection_id].articles
      if (articles.includes(article_id)) {
        dispatch(addMessage({message: 'Ссылка уже добавлена в коллекцию', status: 'system'}))
      } else {
        updateMyCollection({collection_id: collection_id, articles: [...articles, article_id]})
        dispatch(addMessage({message: 'Ссылка добавлена в коллекцию', status: 'success'}))
      }
    }
    setDragOver(false)
  }

  const handleKebabClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.stopPropagation()
    setIsOpenContextMenu(!isOpenContextMenu)
  }

  const handleClickOutside = () => setIsOpenContextMenu(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpenContextMenu(false)
    if (checked === item.key) dispatch(setSelectedMenuItem({id: '0', group: 1}))
    deleteMyCollection(item.key)
  }

  const handleKeyPressTitleEdit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!changeCollectionName) {
        dispatch(addMessage({
          message: 'Имя коллекции не может быть пустым',
          status: 'alert',
          progressMode: 'line'
        }))
      } else {
        if (item.key) {
          const articles = collections.entities[item.key].articles
          updateMyCollection({collection_id: item.key, title: changeCollectionName, articles: articles})
        }
        setOpenRenameField(false)
      }
    }
  }

  const handleChangeCollectionName = (value:  string | null ) => {
    setChangeCollectionName(value)
  }


  const handleRename = () => {
    setIsOpenContextMenu(false)
    setOpenRenameField(true)
    setChangeCollectionName(item.label)
  }

  useEffect(() => {
    if (data.isSuccess && !data.isError) refetch()
  }, [data.isSuccess, data.isError])

  useEffect(() => {
    if (deleteArticleResult.isSuccess) {
      dispatch(addMessage({message: 'Ссылка перемещена в корзину'}))
    }
    if (deleteArticleResult.isError) {
      dispatch(addMessage({message: 'Произошла ошибка, обратитесь к администратору', status: 'alert'}))
    }
  }, [deleteArticleResult])

  useEffect(() => {
    if (updateArticleResult.isSuccess) {
      dispatch(addMessage({message: 'Ссылка помечена звездочкой'}))
    }
    if (updateArticleResult.isError) {
      dispatch(addMessage({message: 'Произошла ошибка, обратитесь к администратору', status: 'alert'}))
    }
  }, [updateArticleResult])

  const items: ContextMenuItemDefault[] = [
    {
      label: 'Переименовать',
      onClick: handleRename
    },
    {
      label: 'Удалить',
      onClick: handleDelete
    }
  ]

  return (
    <div className={`
                ${item.key === checked ? 'border-s-2 border-sky-600' : ''} 
                ${isActive && kind === 'string' && item.availableForDrop && 'bg-gradient-to-r from-gray-300'}
                ${dragOver && item.availableForDrop && 'bg-gradient-to-l from-gray-500'}
                cursor-pointer my-1 flex items-center align-center
              `}
         onClick={() => handleItemClick(item)}
         onDrop={handleOnDrop}
         onDragOver={handleOnDragOver}
         onDragLeave={handleOnDragLeave}
         id={item.key}
    >
      {Icon && !openRenameField && <><Icon size={'s'} view={'secondary'} className={'m-2'}/><span className={'grow w-24 truncate font-light'} title={item.label}>{item.label}</span></>}
      {item.groupId === 2 && !openRenameField &&
          <>
            {!data.isLoading ?
              <>
                <Button
                  ref={kebabRef}
                  view={'clear'}
                  size={'s'}
                  iconLeft={IconKebab}
                  onClick={handleKebabClick}
                  onlyIcon
                />
                <ContextMenu
                  size={'s'}
                  items={items}
                  direction={'rightCenter'}
                  anchorRef={kebabRef}
                  isOpen={isOpenContextMenu}
                  onClickOutside={handleClickOutside}
                  offset={'m'}
                />
              </> :
              <div className={'me-2'}>
                <ProgressSpin size="s"/>
              </div>
            }
          </>
      }
      {/* Article Collection rename dialog */}
      {openRenameField &&
          <TextField status={changeCollectionName ? 'success' : 'alert'}
                     placeholder={'Введите имя коллекции'}
                     onChange={handleChangeCollectionName}
                     onKeyPress={handleKeyPressTitleEdit}
                     value={changeCollectionName}
                     className={'mx-2'}
                     required={true}
                     size={'s'}
          />
      }
    </div>
  )
}