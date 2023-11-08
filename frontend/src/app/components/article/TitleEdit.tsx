import React, {useEffect, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";


export const TitleEdit = () => {
  const [value, setValue] = useState<string | null>('')
  const article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()

  const handleChange = (value: string | undefined) => {
    updateArticle({id: article?.id, title: value})
  }
  const debouncedSetValue = useDebounce(handleChange, 300)

  useEffect(() => debouncedSetValue(value? value : undefined), [value])

  useEffect(() => {setValue(article?.title ? article?.title : null)}, [article])

  return (
    <div className="w-full px-1 rounded hover:border-2 border-dotted border-zinc-500">
      <TextField width={'full'}
                 view={'clear'}
                 placeholder={'Заголовок статьи'}
                 type={'textarea'}
                 minRows={1}
                 maxRows={3}
                 value={value}
                 size={'l'}
                 onChange={({value}) => setValue(value)}
      />
    </div>
  )
}