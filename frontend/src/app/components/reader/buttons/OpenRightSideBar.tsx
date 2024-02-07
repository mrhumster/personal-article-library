import React, {useRef} from "react";
import {Button} from "@consta/uikit/Button";
import {IconInfo} from "@consta/icons/IconInfo"
import {useDispatch, useSelector} from "react-redux";
import {closeSideBar, openSideBar} from "../../../features/ui";
import {RootState} from "../../../store";
import {useFlag} from "@consta/uikit/useFlag";
import {Tooltip} from "@consta/uikit/Tooltip";
import {Text} from "@consta/uikit/Text"
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";

export const OpenRightSideBar = () => {
  const dispatch = useDispatch()
  const article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [isTooltipVisible, setIsTooltipVisible] = useFlag();


  const clickHandler = () => {
    if (isOpen) {
      dispatch(closeSideBar())
    } else {
      if (article) dispatch(openSideBar(article))
    }
  }

  return (
    <>
      <Button
        ref={anchorRef}
        className={'hover:bg-zinc-900'}
        size='s'
        view={isOpen ? 'primary' : 'clear'}
        onlyIcon
        iconLeft={IconInfo}
        onClick={clickHandler}
        onMouseOver={setIsTooltipVisible.on}
        onMouseLeave={setIsTooltipVisible.off}
      />
      <Theme preset={presetGpnDefault}>
      <Tooltip
        isOpen={isTooltipVisible}
        direction="downRight"
        spareDirection="downStartLeft"
        size={'m'}
        placeholder={'ss'}
        anchorRef={anchorRef}
      >
        <Text view="primary" lineHeight="m" size="m">
          Открыть информацию
        </Text>
      </Tooltip>
      </Theme>
    </>
  )
}