import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

import {ArticleUrlsNoExpandedNoUrls} from "./ArticleUrlsNoExpandedNoUrls.tsx";
import {ArticleUrlsNoExpandedWithUrls} from "./ArticleUrlsNoExpandedWithUrls.tsx";
import {ArticleUrlsExpanded} from "./ArticleUrlsExpanded.tsx";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";

import moment from "moment";
import 'moment-timezone';
import "moment/locale/ru"

moment().locale('RU');

export const ArticleUrls = () => {
  const article_id = useSelector((state: RootState) => state.articles.current_article?.id)
  const storeUrls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const [updateArticle] = useUpdateArticleMutation()
  const debounceUpdateArticle = useDebounce(updateArticle, 300)
  const [dateAccessed, setDateAccessed] = useState<string | null>(null)
  const [urls, setUrls] = useState<(string | null)[]>([null])

  const current_timezone = useSelector((state: RootState) => state.ui.timezone)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    e.preventDefault()
    // if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {return;}
    if (expandedRef.current) {
      if (!expandedRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  useEffect(() => {
    // Первоначальная установка состояния из бэка
    if (storeUrls?.date_accessed) {
      setDateAccessed(moment.utc(storeUrls.date_accessed).tz(current_timezone).format('DD.MM.YYYY'))
    }
    if (storeUrls?.urls) {if (storeUrls.urls.length > 0) setUrls(storeUrls.urls)}
  }, [storeUrls])

  useEffect(() => {
    if (!isExpanded && dateAccessed && urls[0] != null) {
      debounceUpdateArticle({
        id: article_id, urls: {
          date_accessed: moment.tz(dateAccessed, 'DD.MM.YYYY', current_timezone),
          urls: urls
        }
      })
    }
  }, [isExpanded])

  return (
    <div>
      <span className={'ms-1 text-zinc-500'}>URLs</span>
      {isExpanded ?
        <ArticleUrlsExpanded expandedRef={expandedRef}
                             datePickerRef={datePickerRef}
                             dateAccessed={dateAccessed}
                             setDateAccessed={setDateAccessed}
                             urls={urls}
                             setUrls={setUrls}
        /> :
        <>
          {storeUrls && storeUrls.urls.length > 0 ?
            <ArticleUrlsNoExpandedWithUrls setIsExpanded={setIsExpanded}/> :
            <ArticleUrlsNoExpandedNoUrls setIsExpanded={setIsExpanded}/>
          }
        </>
      }
    </div>
  )
}