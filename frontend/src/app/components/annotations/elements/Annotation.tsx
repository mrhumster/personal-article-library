import React, {useEffect, useRef} from "react";
import moment from "moment";
import {HighlightScheme} from "../../../types/article.types.ts";
import {
  useCheckUsernameQuery,
  useDeleteHighlightMutation,
  useGetFileQuery,
  useGetHighlightByFileQuery
} from "../../../services/backend";
import {User} from "@consta/uikit/User";
import {Text} from "@consta/uikit/Text";
import {Card} from "@consta/uikit/Card";
import {Button} from "@consta/uikit/Button";
import {Popover} from "@consta/uikit/Popover";
import {useFlag} from "@consta/uikit/useFlag";
import {IconKebab} from "@consta/icons/IconKebab"
import {IconCommentDeleteFilled} from "@consta/icons/IconCommentDeleteFilled"
import {IconCommentStroked} from "@consta/icons/IconCommentStroked"
import {Quote} from "./Quote.tsx";
import {useDispatch, useSelector} from "react-redux";
import {openReader, showHighlight} from "../../../features/ui";
import {openFile} from "../../../features/ui/uiSlice.ts";
import {RootState} from "../../../store";

interface AnnotationPropsIFace {
  instance: HighlightScheme,
}

export const Annotation = ({instance}:AnnotationPropsIFace) => {
  const {data} = useCheckUsernameQuery(instance.owner)
  const [deleteHighlight, {isSuccess}] = useDeleteHighlightMutation()
  const kebabRef = useRef<HTMLButtonElement>(null)
  const [isPopOverVisible, setIsPopOverVisible] = useFlag(false)
  const {refetch} = useGetHighlightByFileQuery(instance.file, {skip: !instance.file})
  const {data: file} = useGetFileQuery(instance.file, {skip: !instance.file})
  const article_id = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const dispatch = useDispatch()

  const kebabClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopOverVisible.on();
  }

  const deleteHandler = () => {
    setIsPopOverVisible.off()
    deleteHighlight(instance.id)
  }

  const showCommentHandler = () => {
    setIsPopOverVisible.off()
    if (file && article_id) {
      dispatch(openReader())
      dispatch(openFile({file: file, article_id: article_id}))
      dispatch(showHighlight(instance))
    }
  }

  useEffect(()=>{
    if (isSuccess) refetch();
  }, [isSuccess])

  return (
    <Card className={'relative'} verticalSpace={'xs'} horizontalSpace={'xs'}>
      {isPopOverVisible &&
        <Popover className={'bg-white shadow'}
                 anchorRef={kebabRef}
                 placeholder='Открыть'
                 direction='leftDown'
                 offset={10}
                 arrowOffset={12}
                 onClickOutside={setIsPopOverVisible.off}>
          <div className='grid grid-cols-1 gap-1 p-1 border rounded shadow-2xl'>
            <Button width='full' size='xs' label='Показать' view='clear' onClick={showCommentHandler} iconLeft={IconCommentStroked}/>
            <Button width='full' size='xs' label='Удалить' view='clear' onClick={deleteHandler} iconLeft={IconCommentDeleteFilled}/>
          </div>
        </Popover>
      }
      <div className='absolute top-3 right-3'>
        <Button onlyIcon iconLeft={IconKebab} size='xs' view='clear' ref={kebabRef} onClick={kebabClickHandler}/>
      </div>
      <div id='commentTitle' className={'select-none w-11/12'}>
        <User width={'full'} name={data?.fullName} info={moment(instance.created).fromNow()}/>
      </div>
      <div id='commentBody' className={'m-1'}>
        <Quote text={instance.quote} />
        <Text className={'ms-1'} size={'s'} weight={'light'} fontStyle={'italic'}>{instance.content}</Text>
      </div>
    </Card>
  )
}