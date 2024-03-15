import React, { useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../../store";
import {AuthorIFace, formErrors} from "../../../types";
import {setNewArticleAuthors} from "../../../features/article";
import {authorToString} from "../../../utils";

import {Button} from "@consta/uikit/Button";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {IconAdd} from "@consta/icons/IconAdd"
import {IconClear} from "@consta/icons/IconClear"
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {setFormErrorByFieldName} from "../../../features/ui";


export const AuthorsField = () => {
  const authors = useSelector((state: RootState) => state.articles.new_article?.authors)
  const [values, setValues] = useState<(string | null)[]>([null])
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['authors'])
  const dispatch = useDispatch()

  useEffect(() => {
    // init
    if (!authors) {
      const emptyAuthor: AuthorIFace = {first_name: undefined, last_name: undefined, sur_name: undefined}
      dispatch(setNewArticleAuthors([emptyAuthor]))
    }
    if (authors) {
      setValues(authors.map((author) => authorToString(author)))
    }
  }, [])

  useEffect(() => {
    const authors: AuthorIFace[] = []
    values.map((value) => {
      const author: AuthorIFace = {first_name: undefined, last_name: undefined, sur_name: undefined}
      if (value) {
        const [last_name, first_name, sur_name] = value
          .replace(/\s+/g, ' ')
          .split(' ', 3)
        author.first_name = first_name
        author.last_name = last_name
        author.sur_name = sur_name
      }
      authors.push(author)
    })
    dispatch(setNewArticleAuthors(authors))
    validate(values)
  }, [values])

  const validate = (values: (string|null)[]) => {
    const fieldName = 'authors'
    const fieldErrors: formErrors = {fieldName: fieldName, errors: []}
    values.map((value, index) => {
      const error = []
      if (value && value.length > 302) error.push('Не более 302 символов')
      fieldErrors.errors[index] = error
    })
    dispatch(setFormErrorByFieldName(fieldErrors))
  }

  const handleChange = (value: string | null, index: number) => {
    setValues(prevState => {
      const values = [...prevState]
      values[index] = value
      return values
    })
  }

  const handleClickAdd = () => {
    setValues(prevState => {
      return [...prevState, null]
    })
  }

  const handleClickDelete = (index: number) => {
    setValues(prevState => {
      return prevState.filter((_, i) => i !== index)
    })
  }

  return (
    <GridItem col={2}>
      {values && values.map((value, index) => {
        if (index === 0)
          return (
            <TextField className={'mb-3'}
                       key={index}
                       label={'Авторы'}
                       value={value}
                       status={errors && errors[index] && errors[index].length > 0 ? 'alert' : undefined}
                       caption={errors && errors[index] && errors[index].join('\n')}
                       placeholder={'Фамилия Имя Отчество'}
                       onChange={(value: string | null) => handleChange(value, index)}
            />
          )
        if (index !== 0)
          return (
            <div className={'mb-3'} key={index}>
              <FieldGroup>
                <TextField value={value}
                           status={errors && errors[index] && errors[index].length > 0 ? 'alert' : undefined}
                           caption={errors && errors[index] && errors[index].join('\n')}
                           placeholder={'Фамилия Имя Отчество'}
                           onChange={(value: string | null) => handleChange(value, index)}
                />
                <Button onlyIcon iconRight={IconClear} view={"secondary"}
                        onClick={() => handleClickDelete(index)}
                />
              </FieldGroup>
            </div>
          )
        }
      )}
      <Button label={'Добавить автора'} iconLeft={IconAdd} view={'clear'} size={'xs'}
              onClick={handleClickAdd}/>
    </GridItem>
  )
}