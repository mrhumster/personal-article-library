import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

import {ArticleUrlsNoExpandedNoUrls} from "./ArticleUrlsNoExpandedNoUrls.tsx";
import {ArticleUrlsNoExpandedWithUrls} from "./ArticleUrlsNoExpandedWithUrls.tsx";
import {ArticleUrlsExpanded} from "./ArticleUrlsExpanded.tsx";

export const ArticleUrls = () => {
  const urls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
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

  return (
    <div>
      <div className={'ms-1 text-zinc-500'}>URLs</div>
      {isExpanded ?
        <ArticleUrlsExpanded expandedRef={expandedRef} datePickerRef={datePickerRef}/> :
        <>
          {urls && urls.urls.length > 0 ?
            <ArticleUrlsNoExpandedWithUrls setIsExpanded={setIsExpanded} /> :
            <ArticleUrlsNoExpandedNoUrls setIsExpanded={setIsExpanded} />
          }
        </>
      }
    </div>
  )
}