import React, {useEffect, useRef, useState} from "react";
import moment from "moment-timezone";
import {useDispatch, useSelector} from "react-redux";
import {setActiveNotebook} from "../../../features/ui";
import {RootState} from "../../../store";
import {
  useDeleteNoteBookMutation,
  useGetArticleQuery,
  useGetNoteBookQuery
} from "../../../services/backend";
import {Card} from "@consta/uikit/Card";
import {Text} from "@consta/uikit/Text"
import {Button} from "@consta/uikit/Button";
import {Popover} from "@consta/uikit/Popover";
import {SkeletonText} from "@consta/uikit/Skeleton";
import {useFlag} from "@consta/uikit/useFlag";
import {IconKebab} from "@consta/icons/IconKebab"
import {IconDocDelete} from "@consta/icons/IconDocDelete"


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
        <Popover className={'bg-white shadow'} anchorRef={kebabRef} placeholder='Открыть' direction='leftDown' offset={10} arrowOffset={12} onClickOutside={setIsPopOverVisible.off}>
          <div className='grid grid-cols-1 gap-1 p-1 border rounded shadow-2xl'>
            <Button width='full' size='xs' label='Удалить страницу' view='clear' onClick={deleteHandler} iconLeft={IconDocDelete}/>
          </div>
        </Popover>
      }
      <div className='absolute top-2 right-2'>
        <Button  onlyIcon iconLeft={IconKebab} size='xs' view='clear' ref={kebabRef} onClick={kebabClickHandler}/>
      </div>
      { data &&
        <>
            <div className={'flex grow items-stretch'}>
                <Text view={data.title ? undefined :'secondary'}
                      className={'w-96'}
                      size='m'
                      truncate
                      weight='regular'
                >{data.title || 'Нет заголовка'}</Text>
            </div>
            <div className={'flex items-stretch'} title={'Последняя правка'}>
                <Text view={'secondary'} size='xs' weight='light'>{moment(data.changed).fromNow()}</Text>
            </div>

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