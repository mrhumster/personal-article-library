import React, {useRef, useState} from "react";
import {Button} from "@consta/uikit/Button";
import {Tooltip} from "@consta/uikit/TooltipCanary";
import {DefaultListItem, List} from "@consta/uikit/ListCanary";
import {presetGpnDark, Theme} from "@consta/uikit/Theme";
import {IconArrowUp} from "@consta/uikit/IconArrowUp";
import {IconArrowDown} from "@consta/uikit/IconArrowDown";

interface SelectedPanelButtonWithTooltipPropsIFace {
  label: string,
  items: DefaultListItem[]
}

export const SelectedPanelButtonWithTooltip = (props: SelectedPanelButtonWithTooltipPropsIFace) => {
   const anchorRef = useRef<HTMLButtonElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const clickHandler = () => {
    setIsTooltipVisible(!isTooltipVisible)
  }

  return (
    <>
      <div className='p-0'>
        <Button
          className='mx-1'
          size='s'
          label={props.label}
          view='secondary'
          type="button"
          onClick={clickHandler}
          ref={anchorRef}
          iconRight={isTooltipVisible ? IconArrowUp : IconArrowDown}
        />
      </div>
      <Theme preset={presetGpnDark}>
        <Tooltip
          isInteractive={true}
          isOpen={isTooltipVisible}
          direction="upCenter"
          spareDirection="downStartLeft"
          size={'m'}
          anchorRef={anchorRef}
          placeholder='Открыть больше'
          onClickOutside={() => setIsTooltipVisible(false)}
        >
        <List size='s' items={props.items} />
      </Tooltip>
        </Theme>
    </>
  );
}