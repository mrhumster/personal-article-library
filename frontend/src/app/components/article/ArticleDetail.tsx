import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetArticleQuery} from "../../services/backend";
import {ReferenceTypeSelect} from "./ReferenceTypeSelect.tsx";
import {TitleEdit} from "./TitleEdit.tsx";
import {AuthorsEdit} from "./AuthorsEdit.tsx";
import {AdditionalInformationEdit} from "./additional_information";
import {ArticleFiles} from "./files";
import {setCurrentArticle} from "../../features/article";
import {ArticleCollectionsEdit} from "./collections";
import {ArticleUrls} from "./urls";
import {Identifiers} from "./identifiers";
import {PubDetails} from "./publication_details";
import {SkeletonBrick, SkeletonText} from "@consta/uikit/Skeleton";


export const ArticleDetail = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const {data, isUninitialized, refetch, isLoading } = useGetArticleQuery(selected_article, {skip: !selected_article })
  const dispatch = useDispatch()
  const active_reader_tab = useSelector((state: RootState) => state.ui.reader.activeTab?.id)
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)


  useEffect(()=>{if (data) dispatch(setCurrentArticle(data))}, [data])

  useEffect(() => {if (selected_article && !isUninitialized) refetch()}, [selected_article, isUninitialized])

  useEffect(() => {
    if (active_reader_tab && isOpen) {
      ids.map(id => {
        if (entities[id].files?.includes(active_reader_tab)) {
          dispatch(setCurrentArticle(entities[id]))
        }
      })

    }
  }, [active_reader_tab, isOpen])

    return (
      <div className='m-4 select-text'>
        { isLoading ? <SkeletonBrick height={30} /> : <ReferenceTypeSelect/>}
        { isLoading ? <SkeletonBrick height={46} className={'my-2'}/> : <TitleEdit/> }
        { isLoading ? <SkeletonBrick height={18} className={'my-2'}/> : <AuthorsEdit/> }
        { isLoading ? <SkeletonBrick height={18} className={'my-2'}/> : <PubDetails/> }
        { isLoading ? <SkeletonBrick height={151} className={'my-2'}/> : <AdditionalInformationEdit/> }
        { isLoading ? <SkeletonText rows={2} /> : <ArticleCollectionsEdit/> }
        { isLoading ? <SkeletonBrick height={40} className={'my-4'}/> : <ArticleFiles/> }
        { isLoading ? <SkeletonBrick height={30} className={'my-2'}/> : <ArticleUrls/> }
        { isLoading ? <SkeletonBrick height={40} className={'my-4'}/> : <Identifiers/> }
      </div>
    )
}