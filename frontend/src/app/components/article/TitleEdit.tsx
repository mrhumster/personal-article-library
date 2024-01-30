import React, {useEffect, useRef, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";


export const TitleEdit = () => {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState<string | null>('')

  const article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()
  const titleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChange = (value: string | undefined) => {
    updateArticle({...article, title: value})
  }
  const debouncedSetValue = useDebounce(handleChange, 300)

  useEffect(() => {
    setValue(article?.title ? article?.title : null)
  }, [article])

  const change = (value: string | null ) => {
    setValue(value)
  }

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (titleRef.current) {
      if (!titleRef.current.contains(e.target as Node)) {
        setActive(false)
        if (value !== article?.title) {
          debouncedSetValue(value ? value : undefined)
        }
        inputRef.current?.blur()  // Потеря фокуса на исходном элементе ввода
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

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
      onChange={change}
      ref={titleRef}
      inputContainerRef={inputRef}
    />

  )
}