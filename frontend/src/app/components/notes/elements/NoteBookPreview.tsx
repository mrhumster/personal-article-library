import React, {useEffect, useRef, useState} from "react";
import {
  useDeleteNoteBookMutation,
  useGetArticleQuery,
  useGetNoteBookQuery
} from "../../../services/backend";
import {Card} from "@consta/uikit/Card";
import {Text} from "@consta/uikit/Text"
import moment from "moment-timezone";
import {SkeletonText} from "@consta/uikit/Skeleton";
import {IconKebab} from "@consta/icons/IconKebab"
import {Button} from "@consta/uikit/Button";
import {useFlag} from "@consta/uikit/useFlag";
import {Popover} from "@consta/uikit/Popover";
import {useDispatch, useSelector} from "react-redux";
import {setActiveNotebook} from "../../../features/ui";
import {RootState} from "../../../store";


interface NoteBookPreviewPropsIFace {
  id: string
}

export const NoteBookPreview = ({id}:NoteBookPreviewPropsIFace) => {
  const {data, isLoading, refetch} = useGetNoteBookQuery(id, {skip: !id})
  const [deleteNoteBook, result] = useDeleteNoteBookMutation()
  const kebabRef = useRef<HTMLButtonElement>(null)
  const [isPopOverVisible, setIsPopOverVisible] = useFlag(false)
  const [articleId, setArticleId] = useState<string | undefined>(undefined)
  const getArticle = useGetArticleQuery(articleId, {skip: !articleId})
  const activeNotebook = useSelector((state: RootState) => state.ui.rightSideBar.activeNotebook)
  const current_timezone = useSelector((state: RootState) => state.ui.timezone)

  useEffect(() => {
    if (!activeNotebook) refetch()
  }, [activeNotebook])

  const dispatch = useDispatch()

  const deleteHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPopOverVisible.off()
    deleteNoteBook(id)
  }

  useEffect(()=>{
    if (result.data) {
      const articles_ids_for_update = result.data.data[0]['related_articles']
      if (articles_ids_for_update) articles_ids_for_update.map((id: string) => {
        setArticleId(id)
      })
    }
  }, [result])

  useEffect(() => {if (!getArticle.isUninitialized) getArticle.refetch()}, [articleId])

  const clickHandler = () => dispatch(setActiveNotebook(id))

  const kebabClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopOverVisible.on();
  }

  return (
    <Card className='h-20 border cursor-pointer relative flex flex-col my-2' horizontalSpace={'s'} verticalSpace={'s'} onClick={() => clickHandler()}>
      {isPopOverVisible &&
        <Popover anchorRef={kebabRef} placeholder='Открыть' direction='leftDown' offset={10} arrowOffset={12} onClickOutside={setIsPopOverVisible.off}>
          <div className='flex flex-col border rounded'>
            <Button width='full' size='s' label='Удалить страницу' view='clear' onClick={deleteHandler}/>
          </div>
        </Popover>
      }
      <div className='absolute top-2 right-2'>
        <Button  onlyIcon iconLeft={IconKebab} size='xs' view='clear' ref={kebabRef} onClick={kebabClickHandler}/>
      </div>
      { data &&
        <>
            <Text className='grow' size='m' weight='semibold'>{data.title || 'Нет заголовка'}</Text>
            <Text size='xs' weight='light'>{moment(data.created).fromNow()}</Text>
            <Text size='xs' weight='light'>{moment(data.created).format()}</Text>
        </>
      }
      { isLoading &&
        <>
          <SkeletonText className='grow' rows={1} fontSize='m' />
          <SkeletonText rows={1} fontSize='xs'/>
        </>
      }
    </Card>
  )
}