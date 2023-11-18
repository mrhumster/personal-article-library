import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetArticleQuery} from "../../services/backend";
import {ReferenceTypeSelect} from "./ReferenceTypeSelect.tsx";
import {TitleEdit} from "./TitleEdit.tsx";
import {AuthorsEdit} from "./AuthorsEdit.tsx";
import {PublicationDetailsEdit} from "../publication_details/PublicationDetailsEdit.tsx";
import {AdditionalInformationEdit} from "../additional_information/AdditionalInformationEdit.tsx";
import {ArticleFiles} from "../article_files";
import {setCurrentArticle} from "../../features/article";
import {ArticleCollectionsEdit} from "../article_collection";


export const ArticleDetail = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const {data, isUninitialized, refetch } = useGetArticleQuery(selected_article, {skip: !selected_article })
  const dispatch = useDispatch()

  useEffect(()=>{if (data) dispatch(setCurrentArticle(data))}, [data])

  useEffect(() => {if (selected_article && !isUninitialized) refetch()}, [selected_article, isUninitialized])

  return (
    <div className='m-4'>
      <ReferenceTypeSelect />
      <TitleEdit />
      <AuthorsEdit />
      <PublicationDetailsEdit />
      <AdditionalInformationEdit />
      <ArticleFiles />
      <ArticleCollectionsEdit />
    </div>
  )
}