import React, {useEffect} from "react";
import {Button} from "@consta/uikit/Button";
import {IconRestart} from "@consta/icons/IconRestart"
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useUpdateArticleMutation} from "../../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";
import { ProgressSpin } from '@consta/uikit/ProgressSpin';

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
    <>
    {!isLoading && <Button width={'full'} view={'ghost'} onlyIcon iconLeft={IconRestart}/>}
    { isLoading &&
        <div className='rounded flex items-center justify-center bg-neutral-700/90 w-10 h-10'>
          <ProgressSpin/>
        </div>
    }
    </>
  )
}