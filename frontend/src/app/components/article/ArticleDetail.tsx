import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetArticleQuery} from "../../services/backend";
import {ReferenceTypeSelect} from "./ReferenceTypeSelect.tsx";
import {TitleEdit} from "./TitleEdit.tsx";
import {AuthorsEdit} from "./AuthorsEdit.tsx";

export const ArticleDetail = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article)
  const { refetch } = useGetArticleQuery(selected_article?.id, {skip: !selected_article?.id})
  useEffect(() => {
    if (selected_article) {
      refetch()
    }
  }, [selected_article])
  return (
    <div className='m-4'>
      <ReferenceTypeSelect />
      <TitleEdit />
      <AuthorsEdit />
    </div>
  )
}