import React, {useEffect, useRef, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useClickOutside} from "@consta/uikit/useClickOutside";
import {setCurrentArticleTitle} from "../../features/article";


export const TitleEdit = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.title)
  const [active, setActive] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState<string | null | undefined>()
  const dispatch = useDispatch()

  useEffect(()=>{
    setTitle(value)
  }, [value])

  const handleClickOutside = () => {
    if (title && title !== value) dispatch(setCurrentArticleTitle(title))
    setActive(false)
  }

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [titleRef]
  })

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
      value={title}
      size={'l'}
      onClick={() => setActive(true)}
      onChange={setTitle}
      ref={titleRef}
      inputContainerRef={inputRef}
    />

  )
}