import React, {useState} from "react";
import {Text} from "@consta/uikit/Text";
import {SelectedPanelButtonWithTooltip as ButtonWithTooltip} from "./SelectedPanelButtonWithTooltip.tsx";
import {DefaultListItem} from "@consta/uikit/ListCanary";
import {Button} from "@consta/uikit/Button";
import {
  useDeleteArticleMutation, useUpdateArticleMutation,
  useUpdateMyCollectionMutation
} from "../../services/backend";
import {useSelector} from "react-redux";
import {AddCollectionDialog} from "./AddCollectionDialog.tsx";
import {RootState} from "../../store";
import {IconAdd} from "@consta/icons/IconAdd";
import {IconRemove} from "@consta/icons/IconRemove";
import {IconFavoriteStroked} from "@consta/icons/IconFavoriteStroked";
import {IconFavoriteFilled} from "@consta/icons/IconFavoriteFilled";
import {IconEye} from "@consta/icons/IconEye";
import {IconEyeClose} from "@consta/icons/IconEyeClose";
import {IconList} from "@consta/icons/IconList"
import {ConfirmDeleteDialog} from "./ConfirmDeleteDialog.tsx";
import moment from "moment";

interface SelectedPanelPropsIFace {
  items: string[],
  copySelectedArticleString?: () => void
}

export const SelectedPanel = (props: SelectedPanelPropsIFace) => {
  const { items, copySelectedArticleString} = props
  const [ deleteArticle, deleteArticleResult] = useDeleteArticleMutation()
  const [ updateMyCollection ] = useUpdateMyCollectionMutation()
  const [ updateArticle, updateArticleResult ] = useUpdateArticleMutation()
  const { entities} = useSelector((state: RootState) => state.collections)
  const articles = useSelector((state: RootState) => state.articles.articles)
  const [ isVisibleAddCollectionDialog, setIsVisibleAddCollectionDialog] = useState<boolean>(false)
  const [ isVisibleConfirmDeleteDialog, setIsVisibleConfirmDeleteDialog] = useState<boolean>(false)
  const checked = useSelector((state: RootState) => state.ui.checked)
  const current_timezone = useSelector((state: RootState) => state.ui.timezone)
  const isSidebarOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)

  if (items.length === 0) return null

  const removeFromCollection = () => {
    updateMyCollection({collection_id: checked.id, articles: entities[checked.id].articles.filter((article_id) => !props.items.includes(article_id))})
  }

  const restoreFromTrash = () => {
    props.items.map((id) => {
      const article = articles.entities[id]
      updateArticle({...article, deleted: false, delete_date: null})
    })

  }

  const markAsFavorite = () => {
    props.items.map((id) => {
      const article = articles.entities[id]
      updateArticle({...article, favorite: true})
    })
  }

  const unmarkAsFavorite = () => {
    props.items.map((id) => {
      const article = articles.entities[id]
      updateArticle({...article, favorite: false})
    })
  }
  const markAsRead = () => {
    props.items.map((id) => {
      const article = articles.entities[id]
      updateArticle({...article, read: true, read_date: moment().tz(current_timezone).utc()})
    })
  }

  const unmarkAsRead = () => {
    props.items.map((id) => {
      const article = articles.entities[id]
      updateArticle({...article, read: false, read_date: null})
    })
  }

  const handleClickCopyArticleString = () => {
    if (copySelectedArticleString) copySelectedArticleString()
  }

  const organizeActions: DefaultListItem[] = [
    {
      label: 'Добавить в коллекцию',
      onClick: () => {setIsVisibleAddCollectionDialog(true)},
      leftIcon: IconAdd
    },
    {
      label: 'Убрать из коллекции',
      onClick: () => {removeFromCollection()},
      leftIcon: IconRemove,
      disabled: checked.group === 1,
    }
  ]

  const markAsActions: DefaultListItem[] = [
    {
      label: 'избранные',
      leftIcon: IconFavoriteFilled,
      onClick: () => {markAsFavorite()}
    },
    {
      label: 'не избранные',
      leftIcon: IconFavoriteStroked,
      onClick: () => {unmarkAsFavorite()}
    },
    {
      label: 'прочитанные',
      leftIcon: IconEye,
      onClick: () => {markAsRead()}
    },
    {
      label: 'не прочитанные',
      leftIcon: IconEyeClose,
      onClick: () => {unmarkAsRead()}
    }
  ]

  const copyToBufferActions: DefaultListItem[] = [
    {
      label: 'Скопировать цитаты',
      leftIcon: IconList,
      onClick: handleClickCopyArticleString
    }
  ]

  const moveToTrash = () => {
    if (props.items) {
      props.items.map((article_id: string) => deleteArticle(article_id))
    }
  }

  return (
    <div className={`flex h-16 border-t border-zinc-400 bg-zinc-100 p-3 ${isSidebarOpen ? 'cropped' : 'w-full'}`}>
      <div id='selectedInformer' className='my-auto ms-2 select-none'>
        <Text weight='bold' display='inline'> {items.length}</Text>
        <Text className='ps-2' display='inline' weight='light'>выделенных ссылок</Text>
      </div>
      <div id='buttonsContainer' className='flex justify-center grow my-auto mx-auto'>
        { checked.id === '6' &&
            <>
              <Button loading={updateArticleResult.isLoading} className='mx-1' label='Восстановить' view='secondary' size='s' onClick={restoreFromTrash}/>
              <Button label="Удалить на всегда" size='s' view='ghost' onClick={() => setIsVisibleConfirmDeleteDialog(true)}/>
            </>
        }
        { checked.id !== '6' &&
            <>
              <ButtonWithTooltip label='Организовать' items={organizeActions}/>
              <ButtonWithTooltip label='Пометить как' items={markAsActions}/>
              <ButtonWithTooltip label='Скопировать' items={copyToBufferActions}/>
              <Button loading={deleteArticleResult.isLoading} className='mx-1' label='Отправить в корзину' view='secondary' size='s' onClick={moveToTrash}/>
            </>
        }
      </div>
      <AddCollectionDialog show={isVisibleAddCollectionDialog} setShow={setIsVisibleAddCollectionDialog} items={items}/>
      <ConfirmDeleteDialog show={isVisibleConfirmDeleteDialog} setShow={setIsVisibleConfirmDeleteDialog} items={items}/>
    </div>
  )
 }