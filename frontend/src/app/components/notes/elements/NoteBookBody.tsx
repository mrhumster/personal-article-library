import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {BlankedNoteBook} from "./BlankedNoteBook.tsx";
import {NoteBookPreview} from "./NoteBookPreview.tsx";

export const NoteBookBody = () => {
  const current_articles = useSelector((state: RootState) => state.articles.current_article)
  if (current_articles?.notebooks && current_articles.notebooks.length === 0) return <BlankedNoteBook />
  return (
    <div className='grow flex flex-col m-5 overflow-y-auto'>
      {current_articles?.notebooks && current_articles?.notebooks.length > 0 && current_articles?.notebooks.map((id:string) => {
        return <NoteBookPreview id={id} key={id} />
      })}
    </div>
  )
}