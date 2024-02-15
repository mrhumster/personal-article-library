import React, {useEffect} from "react";
import {Button} from "@consta/uikit/Button";
import {IconRestart} from "@consta/icons/IconRestart"
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useUpdateArticleMutation} from "../../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";

export const Updater = () => {
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  const articles = useSelector((state: RootState) => state.articles.articles)
  const [updateArticle, {isLoading}] = useUpdateArticleMutation()
  const debounceUpdateArticle = useDebounce(updateArticle, 1000)
  useEffect(()=>{
    const id = current_article?.id
    if (id) {
      if (current_article !== articles.entities[id]) {
        debounceUpdateArticle(current_article)
      }
    }
  }, [current_article])


  return (
    <Button loading={isLoading} view={'ghost'} onlyIcon iconLeft={IconRestart}/>
  )
}