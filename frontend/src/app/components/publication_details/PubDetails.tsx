import React, {useRef, useState} from "react";
import {useUpdateArticleMutation} from "../../services/backend";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {PubDetailsExpanded} from "./PubDetailsExpanded.tsx";
import {PubDetailsCollapse} from "./PubDetailsCollapse.tsx";
import {useClickOutside} from "@consta/uikit/useClickOutside";

export const PubDetails = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [updateArticle] = useUpdateArticleMutation()
  const article = useSelector((state: RootState) => state.articles.current_article)
  const expandedRef = useRef<HTMLInputElement>(null)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
      setExpanded(false);
      updateArticle(article);
  }

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [expandedRef]
  })

  const handleClickInside = () => setExpanded(true);


  if (expanded) return <PubDetailsExpanded ref={expandedRef}/>
  if (!expanded) return <PubDetailsCollapse onClick={handleClickInside}/>
}