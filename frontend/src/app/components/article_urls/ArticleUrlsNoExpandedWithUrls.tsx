import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import Moment from "react-moment";
import {IconLink} from "@consta/uikit/IconLink";
import {IconClose} from "@consta/uikit/IconClose";
import {Button} from "@consta/uikit/Button";
import {useUpdateArticleMutation} from "../../services/backend";

export const ArticleUrlsNoExpandedWithUrls = ({setIsExpanded}:{setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const article_id = useSelector((state: RootState) => state.articles.current_article?.id)
  const urls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [updateArticle] = useUpdateArticleMutation()

  const current_timezone = useSelector((state: RootState) => state.ui.timezone)

  const openInNewTab = (url: string) => {
    const win = window.open(url, '_blank');
    win?.focus();
  }

  const handleClickUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    openInNewTab(url)
  }

  const handleClickDeleteUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    updateArticle({id: article_id, urls: {
      date_accessed: urls?.date_accessed,
      urls: urls?.urls.filter((u) => u !== url)}})
  }

  return (
    <div className={"border border-dotted border-transparent hover:border-sky-700 bg-zinc-100 rounded p-1"}
         onClick={() => setIsExpanded(true)}
    >
      <div className={"text-zinc-700 text-sm text-light m-1"}>Дата посещения:
        <span className={"ms-1"}>
          {urls?.date_accessed && <Moment utc date={urls.date_accessed} tz={current_timezone} format="DD.MM.YYYY"/>}
        </span>
        {urls?.urls.map((url, key) => (
          <div key={key} className={"flex items-center my-1"}>
            <IconLink size={'xs'} view={'brand'}/>
            <span className={'grow ms-1 truncate hover:text-sky-700 hover:underline cursor-pointer'} title={url}
                  onClick={(e) => handleClickUrl(e, url)}>
              {url}
            </span>
            <Button iconLeft={IconClose} size='xs' view='clear' form="round" onClick={(e) => handleClickDeleteUrl(e, url)}/>
          </div>
        ))}
      </div>
    </div>
  )
}
