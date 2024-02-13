import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

import {ArticleUrlsNoExpandedNoUrls} from "./ArticleUrlsNoExpandedNoUrls.tsx";
import {ArticleUrlsNoExpandedWithUrls} from "./ArticleUrlsNoExpandedWithUrls.tsx";
import {ArticleUrlsExpanded} from "./ArticleUrlsExpanded.tsx";
import {useUpdateArticleMutation} from "../../services/backend";

import moment from "moment";
import 'moment-timezone';
import "moment/locale/ru"

moment().locale('RU');

export const ArticleUrls = () => {
  const article = useSelector((state: RootState) => state.articles.current_article)
  const storeUrls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const [updateArticle] = useUpdateArticleMutation()
  const [dateAccessed, setDateAccessed] = useState<string | null>(null)
  const [urls, setUrls] = useState<string[]>([])

  const current_timezone = useSelector((state: RootState) => state.ui.timezone)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (expandedRef.current && !expandedRef.current.contains(e.target as Node)) {
      setIsExpanded(false)
      e.stopImmediatePropagation()
    }

  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  useEffect(() => {
    if (storeUrls?.date_accessed) {
      setDateAccessed(moment.utc(storeUrls.date_accessed).tz(current_timezone).format('DD.MM.YYYY'))
    }
    if (storeUrls?.urls) {if (storeUrls.urls.length > 0) setUrls(storeUrls.urls)}
  }, [storeUrls, article?.id])

  useEffect(() => {
    if (!isExpanded && dateAccessed && urls[0] != null) {
      updateArticle({...article, urls: {date_accessed: moment.tz(dateAccessed, 'DD.MM.YYYY', current_timezone).utc(), urls: urls}})
    }
  }, [isExpanded])

  return (
    <div>
      <span className={'ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'}>URLs</span>
      {isExpanded ?
        <ArticleUrlsExpanded
          expandedRef={expandedRef}
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