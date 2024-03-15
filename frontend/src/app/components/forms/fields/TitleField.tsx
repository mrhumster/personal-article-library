import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {getTitleNameByReferenceType} from "../../../utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleTitle} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const TitleField = () => {
  const reference_type = useSelector((state: RootState) => state.articles.new_article?.reference_type)
  const value = useSelector((state: RootState) => state.articles.new_article?.title)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['title'])
  const dispatch = useDispatch()

  const validate = (value: string) => {
    const fieldName = 'title'
    const fieldError: formErrors = { fieldName: fieldName, errors: [] }
    if (value.length > 300) {fieldError.errors[0] = ['Введите название не более 300 символов']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    if (value) validate(value)
    dispatch(setNewArticleTitle(value))
  }


  return (
    <GridItem col={2}>
      <TextField label={getTitleNameByReferenceType(reference_type)}
                 value={value}
                 caption={errors && errors.join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={errors ? 'alert' : undefined}
      />
    </GridItem>
  )
}