import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {AllReferences} from "../main";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";

export const LayoutMain = () => {
  const item_selected = useSelector((state: RootState) => state.ui.checked)
  let content: React.ReactNode | undefined
  switch (item_selected) {
    case 0:
      content = <AllReferences />
  }
  return (
    <Theme preset={presetGpnDefault}>
      <div id="menu" className="w-full bg-white select-none">
        {content && content}
      </div>
    </Theme>
  )
}