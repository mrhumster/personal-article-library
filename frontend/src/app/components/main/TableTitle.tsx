import {Text} from "@consta/uikit/Text";
import React from "react";

interface TableTitleIFace {
  title?: string
}

export const TableTitle = (props: TableTitleIFace) => {
  return (
      <Text size={'l'} className='ms-5 py-3 font-light flex-grow whitespace-nowrap select-none tracking-tighter truncate w-64'>
        { props.title }
      </Text>
  )
}