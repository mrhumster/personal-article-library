import React, {useEffect, useRef, useState} from "react";
import { Tooltip } from '@consta/uikit/Tooltip';
import { Avatar } from '@consta/uikit/Avatar';
import { IconExit } from '@consta/icons/IconExit';
import { IconSettings } from '@consta/icons/IconSettings';
import { ContextMenu } from '@consta/uikit/ContextMenu';

type Item = {
  label: string;
  imageLeft?: IconComponent;
  imageRight?: IconComponent;
};

const items: Item[] = [
  {
    label: 'Настройки',
    accent: 'primary',
    imageLeft: IconSettings,
  },
  {
    label: 'Выйти',
    accent: 'primary',
    imageLeft: IconExit
  },
];

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef= useRef(undefined)
  const [showTooltip, setShowTooltip] = useState(false)
  // TODO: Закрывать меню по клику вне области
  useEffect(() => {
    if (buttonRef) {
      buttonRef.current.addEventListener('mouseover', () => setShowTooltip(true))
      buttonRef.current.addEventListener('mouseout', () => setShowTooltip(false))
    }
    return () => {
      if (buttonRef) {
        buttonRef.current.removeEventListener('mouseover', () => setShowTooltip(true))
        buttonRef.current.removeEventListener('mouseout', () => setShowTooltip(false))
      }
    }

  }, [buttonRef])


  return (
    <div className="rounded hover:bg-zinc-800 w-12 h-12 flex justify-center items-center"
         style={{'cursor': 'pointer'}}
         ref={buttonRef}
         onClick={() => setIsOpen(!isOpen)}
    >
      <Avatar name="Вадим Матвеев" />
      <Tooltip className={showTooltip && !isOpen? 'z-40':'hidden z-40'}
                       direction="rightCenter"
                       spareDirection="downStartLeft"
                       size="m"
                       anchorRef={buttonRef}
                       isInteractive={false}
                       offset={6}
      >{isOpen ? 'Меню' : 'Аккаунт'}</Tooltip>
      <ContextMenu
        isOpen={isOpen}
        items={items}
        getItemStatus={(item) => item.accent}
        getItemLeftIcon={(item) => item.imageLeft}
        getItemRightIcon={(item) => item.imageRight}
        anchorRef={buttonRef}
        direction={"upRight"}
        offset={-48}
        arrowOffset={-35}
      />
    </div>
  )
}