import React from "react";
import {ArticleIFace} from "../../types";

import {IconFavoriteStroked} from "@consta/icons/IconFavoriteStroked"
import {IconFavoriteFilled} from "@consta/icons/IconFavoriteFilled"
import {useUpdateArticleMutation} from "../../services/backend";

interface FavoriteCellIFace {
  article: ArticleIFace
}

export const FavoriteCell = (props: FavoriteCellIFace) => {
  const {article} = props
  const [ updateArticle ] = useUpdateArticleMutation()

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateArticle({...article, favorite: !article.favorite})
  }

  return (
    <div className='flex justify-items-center w-full h-full'>
      {  article.favorite && <IconFavoriteFilled className='my-auto' view={'warning'} onClick={clickHandler} size={'s'}/> }
      { !article.favorite && <IconFavoriteStroked className='my-auto' view={'ghost'} onClick={clickHandler} size={'s'}/> }
    </div>
  )
}