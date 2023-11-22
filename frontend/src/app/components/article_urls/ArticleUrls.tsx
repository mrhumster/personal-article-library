import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

import {ArticleUrlsNoExpandedNoUrls} from "./ArticleUrlsNoExpandedNoUrls.tsx";
import {ArticleUrlsNoExpandedWithUrls} from "./ArticleUrlsNoExpandedWithUrls.tsx";
import {ArticleUrlsExpanded} from "./ArticleUrlsExpanded.tsx";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";

export const ArticleUrls = () => {
  const article_id = useSelector((state: RootState) => state.articles.current_article?.id)
  const storeUrls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const [updateArticle] = useUpdateArticleMutation()
  const debounceUpdateArticle = useDebounce(updateArticle, 300)
  const [dateAccessed, setDateAccessed] = useState<Date | null>(new Date())
  const [urls, setUrls] = useState<(string | null)[]>([null])

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    e.preventDefault()
    console.log(e.target)
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
    if (storeUrls?.date_accessed) {setDateAccessed(new Date(storeUrls.date_accessed))}
    if (storeUrls?.urls) {if (storeUrls.urls.length > 0) setUrls(storeUrls.urls)}
  }, [storeUrls])

  useEffect(() => {
    console.log(isExpanded, dateAccessed, urls)
    if (!isExpanded && dateAccessed && urls[0] != null) {
      debounceUpdateArticle({
        id: article_id, urls: {
          date_accessed: dateAccessed,
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