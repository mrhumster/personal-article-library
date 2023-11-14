import {Attachment} from "@consta/uikit/Attachment";
import {IconHealth} from "@consta/uikit/IconHealth";
import {filesize} from "filesize";
import moment from "moment";
import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/uikit/IconKebab";
import React, {useRef, useState} from "react";
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {FileScheme} from "../../types";


const items: ContextMenuItemDefault[] = [
  {
    label: 'Удалить'
  },
  {
    label: 'Скачать'
  }
]

const getFileDescription = (file: FileScheme) => {
  return `${file.extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.created).format('DD MMMM YYYY')}`
}

export const AttachFile = ({file}:{file: FileScheme}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className={'flex items-center border rounded my-2'}>
      <Attachment
        withAction={true}
        buttonIcon={IconHealth}
        size={'xs'}
        fileExtension={file.extension}
        fileName={file.file_name}
        fileDescription={getFileDescription(file)}
      />
      <Button ref={ref} label="Больше действий"
              iconRight={IconKebab}
              form={'brick'} size={'s'}
              view={'clear'}
              onClick={() => setIsOpen(!isOpen)}
              onlyIcon
      />
      <ContextMenu
        isOpen={isOpen}
        items={items}
        anchorRef={ref}
        direction="leftCenter"
        size={'s'}
        onClickOutside={() => setIsOpen(false)}
      />
    </div>
  )
}