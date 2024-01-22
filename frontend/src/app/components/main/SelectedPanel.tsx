import React, {useState} from "react";
import {Text} from "@consta/uikit/Text";
import {SelectedPanelButtonWithTooltip as ButtonWithTooltip} from "./SelectedPanelButtonWithTooltip.tsx";
import {DefaultListItem} from "@consta/uikit/ListCanary";
import {Button} from "@consta/uikit/Button";
import {addMessage, Item} from "../../features/alert";
import {useDeleteArticleMutation, useGetArticlesQuery} from "../../services/backend";
import {useDispatch} from "react-redux";
import {AddCollectionDialog} from "./AddCollectionDialog.tsx";

interface SelectedPanelPropsIFace {
  items: string[]
}

export const SelectedPanel = (props: SelectedPanelPropsIFace) => {
  const { items} = props
  const [ deleteArticle] = useDeleteArticleMutation()
  const { refetch } = useGetArticlesQuery({})
  const [ isVisibleAddCollectionDialog, setIsVisibleAddCollectionDialog] = useState<boolean>(false)
  const dispatch = useDispatch()

  if (items.length === 0) return null

  const organizeActions: DefaultListItem[] = [
    {
      label: 'Добавить в коллекцию',
      onClick: () => {setIsVisibleAddCollectionDialog(true)}
    },
    {
      label: 'Убрать из коллекции',
      onClick: () => {console.log('Убрать из коллекции')}
    }
  ]

  const markAsActions: DefaultListItem[] = [
    {
      label: 'избранные'
    },
    {
      label: 'не избранные'
    },
    {
      label: 'прочитанные'
    },
    {
      label: 'не прочитанные'
    }
  ]

  const copyToBufferActions: DefaultListItem[] = [
    {
      label: 'Скопировать цитаты'
    }
  ]

  const moveToTrash = () => {
    if (props.items) {
      props.items.map((article_id: string) => deleteArticle(article_id))
    }

    const alert: Item = {
      message: 'Выделенные ссылки перемещены в корзину',
      status: "normal",
      progressMode: 'timer',
    }

    refetch()
    dispatch(addMessage(alert))
  }

  return (
    <div className='flex h-16 border-t border-zinc-400 bg-zinc-100 p-3'>
      <div id='selectedInformer' className='my-auto ms-2 select-none'>
        <Text weight='bold' display='inline'> {items.length}</Text>
        <Text className='ps-2' display='inline' weight='light'>выделенных ссылок</Text>
      </div>
      <div id='buttonsContainer' className='flex justify-center grow my-auto mx-auto'>
        <ButtonWithTooltip label='Организовать' items={organizeActions}/>
        <ButtonWithTooltip label='Пометить как' items={markAsActions}/>
        <ButtonWithTooltip label='Скопировать' items={copyToBufferActions}/>
        <Button className='mx-1' label='Отправить в корзину' view='secondary' size={'s'} onClick={moveToTrash}/>
      </div>
      <AddCollectionDialog show={isVisibleAddCollectionDialog} setShow={setIsVisibleAddCollectionDialog} items={items}/>
    </div>
  )
 }