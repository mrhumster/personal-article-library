import React, {useEffect, useRef, useState} from "react";
import {IdentifiersExpand} from "./IdentifiersExpand.tsx";
import {IdentifiersCollapse} from "./IdentifiersCollapse.tsx";
import {useUpdateArticleMutation} from "../../services/backend";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useDebounce} from "@consta/uikit/useDebounce";

export const Identifiers = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()
  const debounceUpdateArticle = useDebounce(updateArticle, 300)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    e.preventDefault()
    if (expandedRef.current) {
      if (!expandedRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
        debounceUpdateArticle({id: current_article?.id , identifiers: current_article?.identifiers})
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })

  return (
    <div id="identifiers" className="my-3">
      <span className={'ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'}>Идентификаторы</span>
      {isExpanded && <IdentifiersExpand expandedRef={expandedRef}/>}
      {!isExpanded && <IdentifiersCollapse setIsExpanded={setIsExpanded}/>}
    </div>
  )
}