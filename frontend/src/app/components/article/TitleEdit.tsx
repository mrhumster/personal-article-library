import React, {useEffect, useState} from "react";
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

  const handleChange = (value: string | undefined) => {
    updateArticle({id: article?.id, title: value})
  }
  const debouncedSetValue = useDebounce(handleChange, 300)

  useEffect(() => {setValue(article?.title ? article?.title : null)}, [article])

  const expand = () => {
    setActive(true);
  }

  const close = () => {
    setActive(false)
    debouncedSetValue(value? value : undefined)
  }

  const change = ({ value }:{ value: string | null }) => {
    setValue(value)
  }

  const defaultClasses = 'mt-1 p-1 pt-0 font-bold'
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
        width={'full'}
        view={'clear'}
        placeholder={'Заголовок статьи'}
        type={'textarea'}
        minRows={1}
        maxRows={100}
        value={value}
        size={'l'}
        onFocus={expand}
        onBlur={close}
        onChange={change}
      />

  )
}