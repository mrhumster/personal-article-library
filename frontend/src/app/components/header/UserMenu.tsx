import React, {useEffect, useRef, useState} from "react";
import { Tooltip } from '@consta/uikit/Tooltip';
import { Avatar } from '@consta/uikit/Avatar';
import { IconExit } from '@consta/icons/IconExit';
import { IconSettings } from '@consta/icons/IconSettings';
import {ContextMenu} from '@consta/uikit/ContextMenu';
import {logout} from "../../hooks/user.actions.ts";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthData} from "../../features/auth";
import {IconComponent} from "@consta/uikit/Icon";
import {RootState} from "../../store";

type Item = {
  label: string,
  imageLeft?:  IconComponent,
  accent?:  "alert" | "success" | "warning" | undefined,
  onClick?: () => void
};


export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef= useRef<HTMLDivElement>(null)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const handleClickExit = () => {
    dispatch(clearAuthData())
    logout()
  }
  const items: Item[] = [
    {
      label: 'Настройки',
      imageLeft: IconSettings
    },
    {
      label: 'Выйти',
      imageLeft: IconExit,
      onClick: handleClickExit
    },
  ];

  useEffect(() => {
    if (buttonRef.current) {
      console.log(buttonRef)
      buttonRef.current?.addEventListener('mouseover', () => setShowTooltip(true))
      buttonRef.current?.addEventListener('mouseout', () => setShowTooltip(false))
    }
    return () => {
      if (buttonRef.current) {
        console.log(buttonRef)
        buttonRef.current?.removeEventListener('mouseover', () => setShowTooltip(true))
        buttonRef.current?.removeEventListener('mouseout', () => setShowTooltip(false))
      }
    }

  }, [buttonRef])


  return (
    <div className="rounded hover:bg-zinc-800 w-12 h-12 flex justify-center items-center"
         style={{'cursor': 'pointer'}}
         ref={buttonRef}
         onClick={() => setIsOpen(!isOpen)}
    >
      <Avatar name={auth.fullName} className="select-none" />
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
        onClickOutside={() => setIsOpen(false)}
        getItemStatus={(item) => item.accent}
        getItemLeftIcon={(item) => item.imageLeft}
        size={'s'}
        anchorRef={buttonRef}
        direction={"upRight"}
        offset={-40}
        arrowOffset={-45}
      />
    </div>
  )
}