import {Attachment} from "@consta/uikit/Attachment";
import {IconHealth} from "@consta/icons/IconHealth";
import {filesize} from "filesize";
import moment from "moment";
import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/icons/IconKebab";
import React, {useRef, useState} from "react";
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {FileScheme} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useGetFileQuery, useUpdateArticleMutation} from "../../../services/backend";
import {openReader} from "../../../features/ui";
import {openFile} from "../../../features/ui/uiSlice.ts";
import {Informer} from "@consta/uikit/Informer";
import {truncateString} from "../../../utils";





const getFileDescription = (file: FileScheme) => {
  return `${file.extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.created).format('DD MMMM YYYY')}`
}

export const AttachFile = ({file_id}:{file_id: string}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle, {isLoading}] = useUpdateArticleMutation()
  const dispatch = useDispatch()
  const {data, isError, isSuccess} = useGetFileQuery(file_id)

  const removeFile = (file: FileScheme | undefined) => {
    if (current_article && file) {
      const article_files = current_article.files?.filter((f: string) => f !== file.id)
      updateArticle({...current_article, files: article_files})
    }
  }

  const items: ContextMenuItemDefault[] = [
    {
      label: 'Удалить',
      onClick: () => removeFile(data)
    },
    {
      label: 'Скачать'
    }
  ]

  const handleClickAttachment = () => {
    dispatch(openReader())
    dispatch(openFile(data))
    //dispatch(closeSideBar())
  }

  return (
    <div className={'flex items-center border rounded my-2'}>
      {data && isSuccess && !isError && <>
          <div className='w-[92%]'>
            <Attachment
                withPictogram={true}
                withAction={true}
                buttonIcon={IconHealth}
                size={'xs'}
                fileExtension={data.extension}
                fileName={truncateString(data.file_name, 45)}
                title={data.file_name}
                fileDescription={getFileDescription(data)}
                onClick={handleClickAttachment}
            />
          </div>
          <Button ref={ref} label="Больше действий"
                  iconRight={IconKebab}
                  form={'brick'} size={'s'}
                  view={'clear'}
                  onClick={() => setIsOpen(!isOpen)}
                  onlyIcon
                  loading={isLoading}
          />
          <ContextMenu
              isOpen={isOpen}
              items={items}
              anchorRef={ref}
              direction="leftCenter"
              size={'s'}
              onClickOutside={() => setIsOpen(false)}
          />
      </>
      }
      {isError && <Informer
          status={'alert'}
          title={'Ошибка'}
          view={"bordered"}
          size={'s'}
          label={'Что-то пошло не так с вашим файлом. Свяжитесь с администратором.'}
      />}
    </div>
  )
}