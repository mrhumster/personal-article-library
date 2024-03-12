import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Informer} from "@consta/uikit/Informer";
import {closeSearchDialog, openSideBar, setSelectedMenuItem} from "../../../features/ui";
import {FoundArticleItemIFace} from "../../../types";


export const FoundArticle = ({item}: {item: FoundArticleItemIFace, query?: string}) => {
  const article = useSelector((state: RootState) => state.articles.articles.entities[item._id])
  const dispatch = useDispatch()

  const getTitle = () => {
    if (item && item.highlight && 'title' in item.highlight) {
      return <div className={'card'} dangerouslySetInnerHTML={{__html: item.highlight.title[0]}} />
    }
    return article.title
  }

  const handleClick = () => {
    dispatch(closeSearchDialog())
    dispatch(openSideBar({id: item._id}))
    dispatch(setSelectedMenuItem({id: '0', group: 1}))
  }

  return (
    <Informer className={'cursor-pointer border border-green-100 hover:border-sky-500'}
              label={getTitle()}
              status={'success'}
              view={'bordered'}
              size={'s'}
              onClick={handleClick}
    />
  )
}