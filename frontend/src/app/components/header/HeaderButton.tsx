import React, {useEffect, useRef, useState} from "react";
import { Tooltip } from '@consta/uikit/Tooltip';
import { Button } from '@consta/uikit/Button';


export const HeaderButton = (props) => {
  const { text, icon, active, callback } = props
  const buttonRef = useRef(undefined)
  const [showTooltip, setShowTooltip] = useState(false)

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
    <div>
      <Button view={active? "primary": "secondary"} className="w-20" iconRight={icon} onlyIcon onClick={callback} ref={buttonRef}/>
              <Tooltip className={showTooltip? 'z-40':'hidden z-40'}
                       direction="rightCenter"
                       spareDirection="downStartLeft"
                       size="m"
                       anchorRef={buttonRef}
                       isInteractive={false}
                       offset={9}
              >
                { text }
              </Tooltip>
    </div>
  )
}