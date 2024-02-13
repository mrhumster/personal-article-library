import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {TextField} from "@consta/uikit/TextField";
import {AuthorIFace} from "../../types";
import { Text } from '@consta/uikit/Text';
import {authorsToString} from "../../utils";
import {useClickOutside} from "@consta/uikit/useClickOutside";
import {setCurrentAuthors} from "../../features/article";
import {useDebounce} from "@consta/uikit/useDebounce";


export const AuthorsEdit = () => {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  const dispatch = useDispatch()
  const authors = useSelector((state: RootState) => state.articles.current_article?.authors)
  const article = useSelector((state: RootState) => state.articles.current_article)

  const [updateArticle] = useUpdateArticleMutation()
  const debounceUpdateArticle = useDebounce(updateArticle, 5000)
  const myRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
      handleChange(value)
      setActive(false);
      debounceUpdateArticle(article)
  }

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [myRef]
  })


  useEffect(() => {
    if (authors) {
      const a = authors.map(({first_name, last_name, sur_name}) =>
        `${last_name}${first_name ? ` ${first_name}` : ''}${sur_name ? ` ${sur_name}` : ''}`)
      setValue(a.join('\n'))
    } else {
      setValue(null)
    }
  }, [authors])

  const handleChange = (value: string | null) => {
    const authorsList = value?.split('\n')
    const authors: AuthorIFace[] = []
    if (authorsList) {
      authorsList.map((name) => {
        if (name.length > 1) {
          const [last_name, first_name, sur_name] = name.replace(/\s+/g, ' ').split(' ', 3)
          const author: AuthorIFace = {
            first_name: first_name,
            last_name: last_name,
            sur_name: sur_name
          }
          authors.push(author)
        }
      })
    }
    dispatch(setCurrentAuthors(authors))
  }

  const defaultClasses = 'mt-1 mb-1 p-1 pt-0'
  const activeClasses = 'border rounded border-sky-700'
  const passiveClasses = 'border rounded border-transparent hover:border-sky-700 hover:border-dotted'

  const getClass = () => {
    if (active) {
      return [activeClasses, defaultClasses].join(' ')
    }
    return [passiveClasses, defaultClasses].join(' ')
  }

  return (
    <>
      {!active &&
        <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted py-1"
              onClick={() => setActive(true)}>
          {authors ? authorsToString(authors) : <span className='italic ms-1 font-light text-sm cursor-pointer'>Добавить информацию об авторе(ах)</span>}
        </Text>
      }
      {active &&
        <TextField
          className={getClass()}
          view={'clear'}
          placeholder={'Авторы'}
          type={'textarea'}
          minRows={1}
          maxRows={5}
          value={value}
          ref={myRef}
          caption={'Фамилия имя и отчество. Авторов можно разделить новой строкой.'}
          onChange={setValue}
          size={'s'}
        />
      }
    </>
  )
}