import React, {useRef, useState} from "react";
import {IdentifiersExpand} from "./IdentifiersExpand.tsx";
import {IdentifiersCollapse} from "./IdentifiersCollapse.tsx";
import {useUpdateArticleMutation} from "../../services/backend";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useClickOutside} from "@consta/uikit/useClickOutside";

export const Identifiers = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLDivElement>(null)
  const article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()


  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    setIsExpanded(false)
    updateArticle({...article, identifiers: article?.identifiers})
  }

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside
  })

  return (
    <div id="identifiers" className="my-3">
      <span className={'ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'}>Идентификаторы</span>
      {isExpanded && <IdentifiersExpand expandedRef={expandedRef}/>}
      {!isExpanded && <IdentifiersCollapse setIsExpanded={setIsExpanded}/>}
    </div>
  )
}