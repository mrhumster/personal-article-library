import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";
import {TextField} from "@consta/uikit/TextField";
import {AuthorIFace} from "../../types";
import { Text } from '@consta/uikit/Text';
import {authorsToString} from "../main/AllReferences.tsx";
import {SkeletonText} from "@consta/uikit/Skeleton";
import {Loader} from "@consta/uikit/LoaderCanary";


export const AuthorsEdit = () => {
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState<string | null>('')
  const authors = useSelector((state: RootState) => state.articles.current_article?.authors)
  const id = useSelector((state: RootState) => state.articles.current_article?.id)
  const [updateArticle, {isLoading, result}] = useUpdateArticleMutation()

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

  const change = ({value}: { value: string | null }) => {
    setValue(value)
  }

  const expand = () => {
    setEdit(true);
  }

  const close = () => {
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

  const defaultClasses = 'mt-1 p-1 pt-0'
  const activeClasses = 'border rounded border-sky-700'
  const passiveClasses = 'border rounded border-transparent hover:border-sky-700 hover:border-dotted'

  const getClass = () => {
    if (edit) {
      return [activeClasses, defaultClasses].join(' ')
    }
    return [passiveClasses, defaultClasses].join(' ')
  }

  return (
    <>

      {!edit &&
        <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted"
              onClick={expand} onFocus={expand} onBlur={close}>
          {authors && authorsToString(authors)}
        </Text>
      }


      {edit &&
        <TextField
          className={getClass()}
          width={'full'}
          view={'clear'}
          placeholder={'Авторы'}
          type={'textarea'}
          minRows={1}
          maxRows={5}
          value={value}
          onBlur={close}
          caption={'Имя и фамилия авторов разделенных новой строкой'}
          onChange={change}
        />
      }
    </>
  )
}