import React, {useEffect, useState} from "react";
import {DatePicker} from "@consta/uikit/DatePicker";
import {TextField} from "@consta/uikit/TextField";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconClose} from "@consta/uikit/IconClose";

interface ArticleUrlsExpandedPropsIFace {
  expandedRef : React.RefObject<HTMLDivElement>,
  datePickerRef : React.RefObject<HTMLDivElement>
}

export const ArticleUrlsExpanded = ({expandedRef, datePickerRef}: ArticleUrlsExpandedPropsIFace) => {
  const currentArticleURLs = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [dateAccessed, setDateAccessed] = useState<Date | null>(null)
  const [urls, setUrls] = useState<(string | null)[]>([null])
  const now = new Date()

  const handleClickAddURL = () => {
    setUrls(prev => [...prev, null])
  }

  const handleClickDeleteURL = () => {
    setUrls(prev => prev.splice(prev.length - 1 , 1))
  }

  useEffect(() => {}, [dateAccessed])

  useEffect(() => {
    if (currentArticleURLs?.date_accessed) {
      setDateAccessed(new Date(currentArticleURLs?.date_accessed))
    }
    if (currentArticleURLs?.urls) {
      if (currentArticleURLs.urls.length > 0)
      setUrls(currentArticleURLs.urls)
    }

  }, [currentArticleURLs])

  const handleChangeUrl = (value: string | null, index: number) => {
    console.log(urls)
    setUrls( prev => {
      prev[index] = prev[index] + value
      return prev
    })
    console.log(urls)
  }
  // TODO: Не работает URLS
  return (
    <div ref={expandedRef} className={"border border-sky-700 rounded p-4"}>
      <DatePicker onChange={({ value }) => setDateAccessed(value)}
                  ignoreOutsideClicksRefs={[expandedRef]}
                  label={'Дата доступа'}
                  maxDate={now}
                  value={dateAccessed}
                  ref={datePickerRef}
                  width={'full'}
                  size={'s'}
      />
      {urls.map( (url, index) => (
        <div key={index} className={'relative'}>
          <TextField onChange={({ value }: { value: string | null }) => handleChangeUrl(value, index)}
                     className={'my-2'}
                     size={'s'}
                     label={`${index+1}. URL`}
                     value={url}
                     width={'full'}
          />
          {index !== 0 &&
              <div className={'absolute top-0 right-0 p-2'}>
                <Button onlyIcon iconLeft={IconClose} view={'clear'} form={'round'} size={'xs'} onClick={handleClickDeleteURL}/>
              </div>
          }
        </div>
      ))}
      <Button className={'mt-2'} label={'Добавить еще один URL'} view={'clear'} size={'xs'} iconLeft={IconAdd} onClick={handleClickAddURL}/>
    </div>
  )
}