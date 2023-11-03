import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {AllReferences} from "../main";

export const LayoutMain = () => {
  const item_selected = useSelector((state: RootState) => state.ui.checked)
  let content: React.ReactNode | undefined
  switch (item_selected) {
    case 0:
      content = <AllReferences />
  }
  return (
      <div id="menu" className="w-full bg-white select-none">
        {content && content}
      </div>
  )
}