import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";

import {ArticleUrlsNoExpandedNoUrls} from "./ArticleUrlsNoExpandedNoUrls.tsx";
import {ArticleUrlsNoExpandedWithUrls} from "./ArticleUrlsNoExpandedWithUrls.tsx";
import {ArticleUrlsExpanded} from "./ArticleUrlsExpanded.tsx";
import moment from "moment";
import 'moment-timezone';
import "moment/locale/ru"
import {useClickOutside} from "@consta/uikit/useClickOutside";
import {setCurrentUrls} from "../../features/article";
import {ArticleURLs} from "../../types/article.types.ts";

moment().locale('RU');

export const ArticleUrls = () => {
  const storeUrls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [localCurrentUrls, setLocalCurrentUrls] = useState<ArticleURLs | undefined>(undefined)
  const currentUrls = useSelector((state: RootState) => state.articles.current_article?.urls)

  const handleClickOutside = () => {
    setIsExpanded(false)
    console.log(localCurrentUrls)
    if (localCurrentUrls && JSON.stringify(localCurrentUrls) !== JSON.stringify(currentUrls) ) {
      dispatch(setCurrentUrls(localCurrentUrls))
    }
  }

  useEffect(() => {
    if (currentUrls) setLocalCurrentUrls(currentUrls)
  }, [currentUrls])

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [expandedRef, datePickerRef]
  })

  return (
    <div>
      <span className={'ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'}>URLs</span>
      {  isExpanded && <ArticleUrlsExpanded datePickerRef={datePickerRef}
                                            expandedRef={expandedRef}
                                            localCurrentUrls={localCurrentUrls}
                                            setLocalCurrentUrls={setLocalCurrentUrls}/>
      }
      { !isExpanded && storeUrls && storeUrls.urls.length > 0 ?
        <ArticleUrlsNoExpandedWithUrls setIsExpanded={setIsExpanded}/> :
        <ArticleUrlsNoExpandedNoUrls setIsExpanded={setIsExpanded}/>
      }
    </div>
  )
}