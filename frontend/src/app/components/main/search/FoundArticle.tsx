import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {IconBook} from "@consta/icons/IconBook";
import {Informer} from "@consta/uikit/Informer";


export const FoundArticle = ({item}: {item: any}) => {
  const article = useSelector((state: RootState) => state.articles.articles.entities[item._id])
  const getTitle = () => {
    if (item && item.highlight && 'title' in item.highlight) {
      return <div dangerouslySetInnerHTML={{__html: item.highlight.title[0]}} />
    }
    return article.title
  }

  return (
    <Informer className={'cursor-pointer hover:bg-gray-100'} label={getTitle()} status={'success'} icon={IconBook} view={'bordered'} size={'s'}/>
  )
}