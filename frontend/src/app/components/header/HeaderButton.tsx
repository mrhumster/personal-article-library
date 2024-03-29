import React, {useEffect, useRef, useState} from "react";
import { Tooltip } from '@consta/uikit/Tooltip';
import { Button } from '@consta/uikit/Button';
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconComponent} from "@consta/icons/Icon";

interface HeaderButtonPropsIFace {
  text: string
  icon: IconComponent
  active: boolean
  callback: () => void
}

export const HeaderButton = (props: HeaderButtonPropsIFace) => {
  const {text, icon, active, callback} = props
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

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
    <div>
      <Button view={active ? "primary" : "secondary"} className="w-20" iconLeft={icon} onlyIcon onClick={callback}
              ref={buttonRef}/>
      <Theme preset={presetGpnDefault}>
        <Tooltip className={showTooltip ? 'z-40' : 'hidden z-40'}
                 direction="rightCenter"
                 spareDirection="downStartLeft"
                 size="m"
                 anchorRef={buttonRef}
                 isInteractive={false}
                 offset={9}
                 placeholder={text}
        >
          {text}
        </Tooltip>
      </Theme>
    </div>
  )
}