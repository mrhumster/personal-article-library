import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import Moment from "react-moment";
import {IconLink} from "@consta/icons/IconLink";
import {IconClose} from "@consta/icons/IconClose";
import {Button} from "@consta/uikit/Button";
import {useUpdateArticleMutation} from "../../services/backend";
import {Text} from "@consta/uikit/Text"
import moment from "moment/moment";

export const ArticleUrlsNoExpandedWithUrls = ({setIsExpanded}:{setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const article = useSelector((state: RootState) => state.articles.current_article)
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
    updateArticle({...article, urls: {

      date_accessed: moment(urls?.date_accessed).tz(current_timezone).utc(),
      urls: urls?.urls.filter((u) => u !== url)}})
  }

  return (
    <div className={"border border-dotted border-transparent hover:border-sky-700 bg-zinc-100 rounded p-1"}
         onClick={() => setIsExpanded(true)}
    >
      <div>
        <Text className={"ms-1"} display={'inline'} size={'xs'} weight={'light'}>
          Дата посещения:
          {urls?.date_accessed && <Moment className={'ms-1'} utc date={urls.date_accessed} tz={current_timezone} format="DD.MM.YYYY"/>}
        </Text>
        {urls?.urls.map((url, key) => (
          <div key={key} className={"flex justify-items-center justify-stretch h-full w-full my-1"}>
            <div className='h-full'>
              <IconLink className='mt-2' size={'xs'} view={'link'}/>
            </div>
            <Text
              className={'ms-1 grow hover:text-sky-500'}
              size={'s'}
              weight={'light'}
              decoration={'underline'}
              cursor={'pointer'}
              truncate
              title={url}
              onClick={(e) => handleClickUrl(e, url)}>
              {url}
            </Text>
            <Button iconLeft={IconClose} size='xs' view='clear' form="round" onClick={(e) => handleClickDeleteUrl(e, url)}/>
          </div>
        ))}
      </div>
    </div>
  )
}
