import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleAdditionalInformation} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const EditionField = () => {
  const additional_information = useSelector((state: RootState) => state.articles.new_article?.additional_information)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['additional_information.edition'])
  const dispatch = useDispatch()

  const validate = (value: string) => {
    const fieldName = 'additional_information.edition'
    const fieldError: formErrors = { fieldName: fieldName, errors: [] }
    if (value.length > 200) {fieldError.errors[0] = ['Введите название не более 200 символов']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    if (value) validate(value)
    dispatch(setNewArticleAdditionalInformation({edition: value}))
  }


  return (
    <GridItem col={1}>
      <TextField label={'Издание'}
                 value={additional_information?.edition}
                 caption={errors && errors.join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={(errors && errors.length) ? 'alert' : undefined}
      />
    </GridItem>
  )
}