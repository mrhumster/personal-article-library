import {Attachment} from "@consta/uikit/Attachment";
import {IconHealth} from "@consta/uikit/IconHealth";
import {filesize} from "filesize";
import moment from "moment";
import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/uikit/IconKebab";
import React, {useRef, useState} from "react";
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {FileScheme} from "../../types";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetFileQuery, useUpdateArticleMutation} from "../../services/backend";





const getFileDescription = (file: FileScheme) => {
  return `${file.extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.created).format('DD MMMM YYYY')}`
}

export const AttachFile = ({file_id}:{file_id: string}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle, {isLoading}] = useUpdateArticleMutation()
  const {data} = useGetFileQuery(file_id)

  const removeFile = (file: FileScheme) => {
    if (current_article) {
      const article_files = current_article.files?.filter((f: string) => f !== file.id)
      updateArticle({id: current_article.id, files: article_files})
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


  return (
    <div className={'flex items-center border rounded my-2'}>
      {data && <>
          <Attachment
              withAction={true}
              buttonIcon={IconHealth}
              size={'xs'}
              fileExtension={data.extension}
              fileName={data.file_name}
              fileDescription={getFileDescription(data)}
          />
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
    </div>
  )
}