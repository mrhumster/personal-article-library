import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";

import {ArticleUrlsNoExpandedNoUrls} from "./ArticleUrlsNoExpandedNoUrls.tsx";
import {ArticleUrlsNoExpandedWithUrls} from "./ArticleUrlsNoExpandedWithUrls.tsx";
import {ArticleUrlsExpanded} from "./ArticleUrlsExpanded.tsx";
import moment from "moment";
import 'moment-timezone';
import "moment/locale/ru"
import {useClickOutside} from "@consta/uikit/useClickOutside";
import {setCurrentUrls} from "../../../features/article";
import {ArticleURLs} from "../../../types/article.types.ts";

moment().locale('RU');

export const ArticleUrls = () => {
  const storeUrls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [localCurrentUrls, setLocalCurrentUrls] = useState<ArticleURLs | undefined>(undefined)
  const [dateString, setDateString] = useState<string | null>()
  const currentUrls = useSelector((state: RootState) => state.articles.current_article?.urls)
  const tz = useSelector((state: RootState) => state.ui.timezone)

  useEffect(()=>{
    if (currentUrls?.date_accessed) setDateString(moment.utc(currentUrls.date_accessed).tz(tz).format('DD.MM.YYYY'))
  }, [currentUrls])

  useEffect(() => {
    if (dateString && moment(dateString, 'DD.MM.YYYY').isValid()) setLocalCurrentUrls(prevState => {
      if (prevState) {
        return {
          ...prevState,
          date_accessed: moment(dateString, 'DD.MM.YYYY').tz(tz).toISOString()
        }
      }
    })
  }, [dateString])

  const handleClickOutside = () => {
    setIsExpanded(false)
    if (localCurrentUrls && JSON.stringify(localCurrentUrls) !== JSON.stringify(currentUrls) ) {
      dispatch(setCurrentUrls({
          ...localCurrentUrls,
          urls: localCurrentUrls?.urls.filter(url => url !== "")
        }
      ))
    }
  }


  useEffect(() => {if (currentUrls) setLocalCurrentUrls(currentUrls)}, [currentUrls])

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [expandedRef]
  })

  return (
    <>
      <span className={'ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'}>URLs</span>
      {  isExpanded && <ArticleUrlsExpanded datePickerRef={datePickerRef}
                                            expandedRef={expandedRef}
                                            localCurrentUrls={localCurrentUrls}
                                            setLocalCurrentUrls={setLocalCurrentUrls}
                                            dateString={dateString}
                                            setDateString={setDateString}
      />
      }
      { !isExpanded && storeUrls && storeUrls.urls.length > 0 && <ArticleUrlsNoExpandedWithUrls setIsExpanded={setIsExpanded}/>}
      { !isExpanded && (!storeUrls || storeUrls.urls.length === 0) && <ArticleUrlsNoExpandedNoUrls setIsExpanded={setIsExpanded}/>}
    </>
  )
}