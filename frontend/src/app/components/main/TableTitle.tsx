import {Text} from "@consta/uikit/Text";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

interface TableTitleIFace {
  title?: string
}

export const TableTitle = (props: TableTitleIFace) => {
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  return (
      <Text size={'l'} className={`${isOpen ? 'basis-1/2' : 'flex-grow'} ms-5 py-3 font-light whitespace-nowrap tracking-tighter truncate w-content`}>
        { props.title }
      </Text>
  )
}