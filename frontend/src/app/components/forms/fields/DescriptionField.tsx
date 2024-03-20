import React, {useEffect} from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleDescription} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const DescriptionField = () => {
  const value = useSelector((state: RootState) => state.articles.new_article?.description)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['description'])
  const dispatch = useDispatch()

  const validate = (value: string | null | undefined) => {
    const fieldName = 'description'
    const fieldError: formErrors = { fieldName: fieldName, errors: [[]] }
    if (value && value.length > 3900) {fieldError.errors[0].push('Введите название не более 3900 символов')}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    validate(value)
    dispatch(setNewArticleDescription(value))
  }

  useEffect(()=>{validate(value)}, [])

  return (
    <GridItem col={2}>
      <TextField label={'Описание'}
                 type={'textarea'}
                 minRows={3}
                 value={value}
                 caption={errors && errors[0] && errors[0].join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={(errors && errors[0] && errors[0].length > 0) ? 'alert' : undefined}
      />
    </GridItem>
  )
}