import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {HighlightsFromFile} from "./elements";
import {useGetArticleQuery} from "../../services/backend";
import {setCurrentArticle} from "../../features/article";

export const Annotations = () => {
  const files = useSelector((state: RootState) => state.articles.current_article?.files)
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const {data, isUninitialized, refetch } = useGetArticleQuery(selected_article, {skip: !selected_article })
  const dispatch = useDispatch()
  useEffect(()=>{if (data) dispatch(setCurrentArticle(data))}, [data])
  useEffect(() => {if (selected_article && !isUninitialized) refetch()}, [selected_article, isUninitialized])


  return (
    <div id='annotations' className={'flex flex-col p-5'} key={selected_article}>
      <span className='ms-1 mb-4 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em] select-none'>Комментарии</span>
      {files && files.map((file_id, index) =>
        <HighlightsFromFile file_id={file_id} key={index} />
      )}
    </div>
  )
}