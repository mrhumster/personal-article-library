import React, {useEffect} from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleAdditionalInformation} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const CountryField = () => {
  const value = useSelector((state: RootState) => state.articles.new_article?.additional_information?.country)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['additional_information.country'])
  const dispatch = useDispatch()

  const validate = (value: string | null | undefined) => {
    const fieldName = 'additional_information.country'
    const fieldError: formErrors = { fieldName: fieldName, errors: [[]] }
    if (value && value.length > 200) {fieldError.errors[0].push('Введите название не более 200 символов')}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    validate(value)
    dispatch(setNewArticleAdditionalInformation({country: value}))
  }

  useEffect(()=>{validate(value)}, [])

  return (
    <GridItem col={2}>
      <TextField label={'Страна'}
                 value={value}
                 caption={errors && errors[0] && errors[0].join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={(errors && errors[0] && errors[0].length > 0) ? 'alert' : undefined}
      />
    </GridItem>
  )
}