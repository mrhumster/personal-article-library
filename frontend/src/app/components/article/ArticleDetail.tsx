import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export const ArticleDetail = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  return (
    <div className='m-4'>
      <p className='text-rose-500 text-xs'>{selected_article?.id}</p>
    </div>
  )
}