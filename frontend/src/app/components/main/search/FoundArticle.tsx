import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {IconBook} from "@consta/icons/IconBook";
import {Informer} from "@consta/uikit/Informer";
import {closeSearchDialog, openSideBar, setSelectedMenuItem} from "../../../features/ui";


export const FoundArticle = ({item, query}: {item: any, query: string}) => {
  const article = useSelector((state: RootState) => state.articles.articles.entities[item._id])
  const dispatch = useDispatch()

  const getTitle = () => {
    if (item && item.highlight && 'title' in item.highlight) {
      return <div dangerouslySetInnerHTML={{__html: item.highlight.title[0]}} />
    }
    return article.title
  }

  const handleClick = () => {
    dispatch(closeSearchDialog())
    dispatch(openSideBar({id: item._id}))
    dispatch(setSelectedMenuItem({id: '0', group: 1}))
  }

  return (
    <Informer className={'cursor-pointer hover:bg-gray-100'}
              label={getTitle()}
              status={'success'}
              icon={IconBook}
              view={'bordered'}
              size={'s'}
              onClick={handleClick}
    />
  )
}