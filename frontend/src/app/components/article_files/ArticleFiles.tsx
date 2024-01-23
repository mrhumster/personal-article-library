import React from 'react'
import {IconHealth} from "@consta/icons/IconHealth";
import {AddNewFileButton} from "../panel/AddNewFileButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {AttachFile} from "./AttachFile.tsx";

export const ArticleFiles = () => {
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  return (
    <div className={'my-5'}>
      <div className='flex justify-start align-center items-center mt-3'>
        <span className='ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'>Вложения</span>
        <AddNewFileButton article={current_article?.id} text={<IconHealth view={'brand'} className="ms-1" size={'s'}/>}/>
      </div>
      <div>
        {current_article?.files && current_article.files.map((file_id: string, index) =>
          <AttachFile key={index} file_id={file_id}/>)
        }
      </div>
    </div>
  )
}