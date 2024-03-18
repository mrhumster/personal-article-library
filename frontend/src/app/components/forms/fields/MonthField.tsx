import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleAdditionalInformation} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const MonthField = () => {
  const additional_information = useSelector((state: RootState) => state.articles.new_article?.additional_information)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['additional_information.month'])
  const dispatch = useDispatch()

  const validate = (value: string) => {
    const fieldName = 'additional_information.month'
    const fieldError: formErrors = { fieldName: fieldName, errors: [] }
    if (Number(value) > 12 || Number(value) < 1) {fieldError.errors[0] = ['Значение от 1 до 12']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    if (value) validate(value)
    dispatch(setNewArticleAdditionalInformation({month: value}))
  }


  return (
    <GridItem col={1}>
      <TextField label={'Месяц'}
                 value={additional_information?.month}
                 incrementButtons={false}
                 min={1}
                 max={12}
                 caption={errors && errors.join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={(errors && errors.length) ? 'alert' : undefined}
      />
    </GridItem>
  )
}