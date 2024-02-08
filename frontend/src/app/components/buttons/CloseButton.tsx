import {Button} from "@consta/uikit/Button";
import {IconClose} from "@consta/icons/IconClose";
import React from "react";

interface CloseButtonPropsIFace {
  callback: () => void
}

export const CloseButton = (props: CloseButtonPropsIFace) => {
  const { callback } = props
  return (
    <div className="absolute top-0 right-0 m-1">
      <Button iconLeft={IconClose} size='xs' view='clear' form="round" onClick={callback}/>
    </div>
  )
}