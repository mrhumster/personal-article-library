import {Button} from "@consta/uikit/Button";
import {IconKebab} from "@consta/uikit/IconKebab";
import React, {useRef, useState} from "react";
import {Item} from "./TabsMenu.tsx";
import {ContextMenu} from "@consta/uikit/ContextMenu";
import {Tooltip} from "@consta/uikit/Tooltip";

const items: Item[] = [
  {
    label: 'Переименовать'
  },
  {
    label: 'Удалить'
  }
]

export const collectionsMenuItemButton = (item: Item) => {
  const groupId = item.groupId
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const ref = useRef(null);

  if (groupId === 2) {
    return <>
      <Button iconLeft={IconKebab} onlyIcon
              size={'xs'}
              view={'ghost'}
              ref={ref}
              onClick={() => setIsOpen(!isOpen)}
              onMouseOver={() => setShowTooltip(true)}
              onMouseOut={() => setShowTooltip(false)}
      />
      <ContextMenu items={items}
                   isOpen={isOpen}
                   getItemLabel={(item) => item.label}
                   anchorRef={ref}
                   onClickOutside={() => setIsOpen(false)}
                   size={'s'}
                   direction={"rightStartUp"}
                   offset={5}
                   arrowOffset={10}
      />
      <Tooltip className={showTooltip && !isOpen? 'z-40':'hidden z-40'}
               direction={"rightCenter"}
               spareDirection="downStartLeft"
               size="m"
               anchorRef={ref}
               isInteractive={false}
               offset={6}
      >Больше действий</Tooltip>
    </>
  }
}