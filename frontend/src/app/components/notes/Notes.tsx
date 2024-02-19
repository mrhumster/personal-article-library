import React, {useEffect} from "react";
import {NoteBookBody, NoteBookFooter} from "./elements";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setCurrentArticle} from "../../features/article";
import {useGetArticleQuery} from "../../services/backend";
import {NoteBookReader} from "./elements/NoteBookReader.tsx";

export const Notes = () => {
  const selected_article = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const {data, isUninitialized, refetch } = useGetArticleQuery(selected_article, {skip: !selected_article })
  const dispatch = useDispatch()
  const activeNotebook = useSelector((state: RootState) => state.ui.rightSideBar.activeNotebook)

  useEffect(()=>{if (data) dispatch(setCurrentArticle(data))}, [data])
  useEffect(() => {if (selected_article && !isUninitialized) refetch()}, [selected_article, isUninitialized])

  return (
      <div key={selected_article} id='notebook' className='flex flex-col'>
        { !activeNotebook && <>
          <NoteBookBody/>
          <NoteBookFooter/>
        </>}
        { activeNotebook && <NoteBookReader id={activeNotebook}/>}
      </div>
    )
}