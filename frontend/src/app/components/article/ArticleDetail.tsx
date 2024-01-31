import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetArticleQuery} from "../../services/backend";
import {ReferenceTypeSelect} from "./ReferenceTypeSelect.tsx";
import {TitleEdit} from "./TitleEdit.tsx";
import {AuthorsEdit} from "./AuthorsEdit.tsx";
import {AdditionalInformationEdit} from "../additional_information/AdditionalInformationEdit.tsx";
import {ArticleFiles} from "../article_files";
import {setCurrentArticle} from "../../features/article";
import {ArticleCollectionsEdit} from "../article_collection";
import {ArticleUrls} from "../article_urls";
import {Identifiers} from "../identifiers";
import {PubDetails} from "../publication_details";


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
      <PubDetails />
      <AdditionalInformationEdit />
      <ArticleCollectionsEdit />
      <ArticleFiles />
      <ArticleUrls />
      <Identifiers />
    </div>
  )
}