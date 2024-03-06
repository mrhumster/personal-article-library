import React, {useEffect, useRef, useState} from "react";
import { Tooltip } from '@consta/uikit/Tooltip';
import { Avatar } from '@consta/uikit/Avatar';
import { IconExit } from '@consta/icons/IconExit';
import { IconSettings } from '@consta/icons/IconSettings';
import {ContextMenu, ContextMenuItemDefault} from '@consta/uikit/ContextMenu';
import {logout} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthData} from "../../features/auth";
import {RootState} from "../../store";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {resetCollection} from "../../features/collections";
import {resetUi} from "../../features/ui";
import {resetArticle} from "../../features/article";
import {addMessage} from "../../features/alert";
import { useNavigate } from "react-router-dom";


export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef= useRef<HTMLDivElement>(null)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleClickExit = () => {
    dispatch(clearAuthData())
    dispatch(resetCollection())
    dispatch(resetUi())
    dispatch(resetArticle())
    dispatch(addMessage({'message': 'Вы вышли из системы'}))
    logout()
    navigate('/login')
  }
  const items: ContextMenuItemDefault[] = [
    {
      label: 'Настройки',
      leftIcon: IconSettings
    },
    {
      label: 'Выйти',
      leftIcon: IconExit,
      onClick: handleClickExit
    },
  ];

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current?.addEventListener('mouseover', () => setShowTooltip(true))
      buttonRef.current?.addEventListener('mouseout', () => setShowTooltip(false))
    }
    return () => {
      if (buttonRef.current) {
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
      <Avatar name={auth.fullName} className="" />
      <Theme preset={presetGpnDefault}>
      <Tooltip className={showTooltip && !isOpen? 'z-40':'hidden z-40'}
               direction="rightCenter"
               spareDirection="downStartLeft"
               size="m"
               anchorRef={buttonRef}
               isInteractive={false}
               offset={6}
               placeholder={isOpen ? 'Меню' : 'Аккаунт'}
      >{isOpen ? 'Меню' : 'Аккаунт'}</Tooltip>
      <ContextMenu
        isOpen={isOpen}
        items={items}
        onClickOutside={() => setIsOpen(false)}
        getItemStatus={(item) => item.status}
        getItemLeftIcon={(item) => item.leftIcon}
        size={'s'}
        anchorRef={buttonRef}
        direction={"upRight"}
        offset={-40}
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        arrowOffset={-45}
      />
      </Theme>
    </div>
  )
}