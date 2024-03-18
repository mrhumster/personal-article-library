import React, { useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../../store";
import {AuthorIFace, formErrors} from "../../../types";
import {setNewArticleAdditionalInformation, setNewArticleAuthors} from "../../../features/article";
import {authorToString} from "../../../utils";

import {Button} from "@consta/uikit/Button";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {IconAdd} from "@consta/icons/IconAdd"
import {IconClear} from "@consta/icons/IconClear"
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {setFormErrorByFieldName} from "../../../features/ui";


export const EditorsField = () => {
  const editors = useSelector((state: RootState) => state.articles.new_article?.additional_information?.editors)
  const [values, setValues] = useState<(string | null)[]>([null])
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['additional_information.editors'])
  const dispatch = useDispatch()

  useEffect(() => {
    // init
    if (!editors) {
      const emptyAuthor: AuthorIFace = {first_name: undefined, last_name: undefined, sur_name: undefined}
      dispatch(setNewArticleAuthors([emptyAuthor]))
    }
    if (editors) {
      setValues(editors.map((author) => authorToString(author)))
    }
  }, [])

  useEffect(() => {
    const editors: AuthorIFace[] = []
    values.map((value) => {
      const editor: AuthorIFace = {first_name: undefined, last_name: undefined, sur_name: undefined}
      if (value) {
        const [last_name, first_name, sur_name] = value
          .replace(/\s+/g, ' ')
          .split(' ', 3)
        editor.first_name = first_name
        editor.last_name = last_name
        editor.sur_name = sur_name
      }
      editors.push(editor)
    })
    dispatch(setNewArticleAdditionalInformation({editors: editors}))
    validate(values)
  }, [values])

  const validate = (values: (string|null)[]) => {
    const fieldName = 'additional_information.editors'
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
                       label={'Редакторы'}
                       value={value}
                       status={errors && errors[index] && errors[index].length > 0 ? 'alert' : undefined}
                       caption={errors && errors[index] && errors[index].join('\n')}
                       placeholder={'Фамилия Имя Отчество'}
                       withClearButton
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
                           withClearButton
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
      <Button label={'Добавить редактора'} iconLeft={IconAdd} view={'clear'} size={'xs'}
              onClick={handleClickAdd} disabled={!values[values.length-1]}/>
    </GridItem>
  )
}