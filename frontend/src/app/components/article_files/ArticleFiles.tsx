import React from 'react'
import {IconHealth} from "@consta/uikit/IconHealth";
import {AddNewFileButton} from "../panel/AddNewFileButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {AttachFile} from "./AttachFile.tsx";

export const ArticleFiles = () => {
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  return (
    <>
      <div className='flex justify-start align-center items-center mt-3'>
        <span className='ms-1 text-zinc-500'>Файлы</span>
        <AddNewFileButton article={current_article?.id} text={<IconHealth view={'link'} className="ms-2" size={'s'}/>}/>
      </div>
      <div>
        {current_article?.files && current_article.files.map((file_id: string, index) =>
          <AttachFile key={index} file_id={file_id}/>)
        }
      </div>
    </>
  )
}