import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";
import {TextField} from "@consta/uikit/TextField";
import {AuthorIFace} from "../../types";
import { Text } from '@consta/uikit/Text';
import {authorsToString} from "../../utils";


// TODO: Переделать компонент. Необходимо добавить отчество, как в редакторах !!! Чета не правильно

export const AuthorsEdit = () => {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  const authors = useSelector((state: RootState) => state.articles.current_article?.authors)
  const id = useSelector((state: RootState) => state.articles.current_article?.id)
  const [updateArticle] = useUpdateArticleMutation()

  const myRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (myRef.current) {
      if (!myRef.current.contains(e.target as Node)) {
        // Update to backend
        const authorsList = value?.split('\n')
        const authors: AuthorIFace[] = []
        if (authorsList) {
          authorsList.map((name) => {
            if (name.length > 1) {
              const [ last_name, first_name, sur_name] = name.replace(/\s+/g, ' ').split(' ', 3)
              const author: AuthorIFace = {
                first_name: first_name,
                last_name: last_name,
                sur_name: sur_name
              }
              authors.push(author)
            }
          })
        }
        debouncedSetValue(authors)
        setActive(false);
      }
    }
  }

  const handleClickInside = () => setActive(true);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  const handleChange = (authors: AuthorIFace[]) => {
    updateArticle({id: id, authors: authors})
  }

  const debouncedSetValue = useDebounce(handleChange, 300)


  useEffect(() => {
    if (authors) {
      const a = authors.map(({first_name, last_name, sur_name}) =>
        `${last_name}${first_name ? ` ${first_name}` : ''}${sur_name ? ` ${sur_name}` : ''}`)
      setValue(a.join('\n'))
    }
  }, [authors])

  const change = ({value}: { value: string | null }) => {
    setValue(value)
  }


  const defaultClasses = 'mt-1 p-1 pt-0'
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
          width={'full'}
          view={'clear'}
          placeholder={'Авторы'}
          type={'textarea'}
          minRows={1}
          maxRows={5}
          value={value}
          ref={myRef}
          onClick={handleClickInside}
          caption={'Фамилия имя и отчество. Персоны можно разделить новой строкой.'}
          onChange={change}
        />
      }
    </>
  )
}