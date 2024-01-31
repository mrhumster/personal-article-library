import React, {useEffect, useRef, useState} from "react";
import {useUpdateArticleMutation} from "../../services/backend";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {PubDetailsExpanded} from "./PubDetailsExpanded.tsx";
import {PubDetailsCollapse} from "./PubDetailsCollapse.tsx";

export const PubDetails = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [updateArticle] = useUpdateArticleMutation()
  const article = useSelector((state: RootState) => state.articles.current_article)
  const expandedRef = useRef<HTMLInputElement>(null)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (expandedRef.current && !expandedRef.current.contains(e.target as Node)) {
      setExpanded(false);
      updateArticle(article)
    }
  }

  const handleClickInside = () => setExpanded(true);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  if (expanded) return <PubDetailsExpanded ref={expandedRef}/>
  if (!expanded) return <PubDetailsCollapse onClick={handleClickInside}/>
}