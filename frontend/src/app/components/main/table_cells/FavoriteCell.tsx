import React from "react";
import {ArticleIFace} from "../../../types";

import {IconFavoriteStroked} from "@consta/icons/IconFavoriteStroked"
import {IconFavoriteFilled} from "@consta/icons/IconFavoriteFilled"
import {useUpdateArticleMutation} from "../../../services/backend";

interface FavoriteCellIFace {
  article: ArticleIFace | undefined,
  size?: 'xs' | 's' | 'm' | 'l'
}

export const FavoriteCell = (props: FavoriteCellIFace) => {
  const {article, size = 's'} = props
  const [ updateArticle ] = useUpdateArticleMutation()

  const clickHandler = (e: React.MouseEvent) => {
    if (article) {
      e.stopPropagation()
      updateArticle({...article, favorite: !article.favorite})
    }
  }

  if (article) {
    return (
      <div className='flex justify-items-center w-10 h-full my-auto cursor-pointer'>
        {article.favorite &&
            <IconFavoriteFilled className='my-auto mx-auto hover:scale-110 hover:bg-zinc-300 rounded-full' view={'warning'} onClick={clickHandler} size={size}/>}
        {!article.favorite &&
            <IconFavoriteStroked className='my-auto mx-auto hover:scale-110 hover:bg-zinc-300 rounded-full' view={'ghost'} onClick={clickHandler} size={size}/>}
      </div>
    )
  }
}