import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetArticleQuery} from "../../services/backend";
import {ReferenceTypeSelect} from "./ReferenceTypeSelect.tsx";
import {TitleEdit} from "./TitleEdit.tsx";
import {AuthorsEdit} from "./AuthorsEdit.tsx";
import {PublicationDetailsEdit} from "../publication_details/PublicationDetailsEdit.tsx";
import {AdditionalInformationEdit} from "../additional_information/AdditionalInformationEdit.tsx";
import {ArticleFiles} from "../article_files";


export const ArticleDetail = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const { isUninitialized, refetch } = useGetArticleQuery(selected_article, {skip: !selected_article })
  useEffect(() => {
    if (selected_article && !isUninitialized) {
      refetch()
    }
  }, [selected_article, isUninitialized])

  return (
    <div className='m-4'>
      <ReferenceTypeSelect />
      <TitleEdit />
      <AuthorsEdit />
      <PublicationDetailsEdit />
      <AdditionalInformationEdit />
      <ArticleFiles />
    </div>
  )
}