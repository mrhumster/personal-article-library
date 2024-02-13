import React, {useRef, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {useClickOutside} from "@consta/uikit/useClickOutside";
import {setCurrentArticleTitle} from "../../features/article";


export const TitleEdit = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.title)
  const [active, setActive] = useState(false)
  const article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()
  const titleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    updateArticle(article)
    setActive(false)
  }

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [titleRef]
  })

  const handleChange = (value: string | null) => {
    dispatch(setCurrentArticleTitle(value))
  }

  const defaultClasses = 'mt-1 mb-1 p-1 pt-0 font-bold'
  const activeClasses = 'border rounded border-sky-700'
  const passiveClasses = 'border rounded border-transparent hover:border-sky-700 hover:border-dotted'

  const getClass = () => {
    if (active) {
      return [activeClasses, defaultClasses].join(' ')
    }
    return [passiveClasses, defaultClasses].join(' ')
  }

  return (
    <TextField
      className={getClass()}
      view={'clear'}
      placeholder={'Заголовок статьи'}
      type={'textarea'}
      minRows={1}
      maxRows={100}
      value={value}
      size={'l'}
      onClick={() => setActive(true)}
      onChange={handleChange}
      ref={titleRef}
      inputContainerRef={inputRef}
    />

  )
}