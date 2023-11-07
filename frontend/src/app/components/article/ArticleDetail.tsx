import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetArticleQuery} from "../../services/backend";
import {ReferenceTypeSelect} from "./ReferenceTypeSelect.tsx";

export const ArticleDetail = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  const {data, refetch, isLoading, isError} = useGetArticleQuery(selected_article?.id, {skip: !selected_article?.id})
  return (
    <div className='m-4'>
      <ReferenceTypeSelect />
    </div>
  )
}