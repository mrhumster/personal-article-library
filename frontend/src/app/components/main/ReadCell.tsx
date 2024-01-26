import {ArticleIFace} from "../../types";
import React from "react";

import {IconRecord} from "@consta/icons/IconRecord"

interface ReadCellIFace {
  article: ArticleIFace
}

export const ReadCell = (props: ReadCellIFace) => {
  const {article} = props
  return (
    <div className='flex justify-items-center h-full w-full'>
      { !article.read && <IconRecord className='my-auto' view={'success'} size={'m'}/> }
    </div>
  )
}