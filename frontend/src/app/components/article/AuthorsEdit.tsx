import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";
import {TextField} from "@consta/uikit/TextField";
import {AuthorIFace} from "../../types";
import { Text } from '@consta/uikit/Text';
import {authorsToString} from "../main/AllReferences.tsx";


export const AuthorsEdit = () => {
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState<string | null>('')
  const authors = useSelector((state: RootState) => state.articles.current_article?.authors)
  const id = useSelector((state: RootState) => state.articles.current_article?.id)
  const [updateArticle] = useUpdateArticleMutation()

  const handleChange = (authors: AuthorIFace[]) => {
    updateArticle({id: id, authors: authors})
  }
  const debouncedSetValue = useDebounce(handleChange, 300)


  useEffect(() => {
    if (authors) {
        const a = authors.map(({first_name, last_name}) => `${first_name} ${last_name}`)
        setValue(a.join('\n'))
    }
  }, [authors])

  function expand() {
    setEdit(true);
  }

  function close() {
    const authorsList = value?.split('\n')
    const authors: AuthorIFace[] = []
    if (authorsList) {
      authorsList.map((name) => {
        if (name.length > 1) {
          const [first_name, last_name] = name.replace(/\s+/g, ' ').split(' ', 2)
          const author: AuthorIFace = {
            first_name: first_name,
            last_name: last_name
          }
          authors.push(author)
        }
      })
    }
    debouncedSetValue(authors)
    setEdit(false);
  }

  return (
    <div className="w-full my-3 px-1 rounded hover:border-2 border-dotted border-zinc-500" tabIndex={0}>
      {!edit &&
          <Text onClick={expand} onFocus={expand}>{authorsToString(authors)}</Text>
      }
      {edit &&
          <TextField width={'full'}
                     view={'clear'}
                     placeholder={'Авторы'}
                     type={'textarea'}
                     minRows={1}
                     maxRows={5}
                     value={value}
                     onBlur={close}
                     caption={'Имя и фамилия авторов разделенных новой строкой'}
                     onChange={({value}) => setValue(value)}
          />
      }
    </div>
  )
}