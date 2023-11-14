import React from 'react'
import {IconHealth} from "@consta/uikit/IconHealth";
import {AddNewFileButton} from "../panel/AddNewFileButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Attachment} from "@consta/uikit/Attachment";
import {FileScheme} from "../../types";
import {filesize} from "filesize";
import moment from "moment/moment";

export const ArticleFiles = () => {
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  return (
    <>
      <div className='flex justify-start align-center items-center mt-3'>
        <span className='ms-1 text-zinc-500'>Файлы</span>
        <AddNewFileButton article={current_article?.id} text={<IconHealth view={'link'} className="ms-2" size={'s'}/>} />
      </div>
      <div>
        { current_article?.files && current_article.files.map(
          (file: FileScheme, index) =>
            <div key={index}>
            <Attachment
              withAction={true}
              buttonIcon={IconHealth}
              size={'m'}
              fileExtension={file.extension}
              fileName={file.file_name}
              fileDescription={`${file.extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.created).format('DD MMMM YYYY')}`}
            />
            </div>
        )}
        </div>
    </>
  )
}