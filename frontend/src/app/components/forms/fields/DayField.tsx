import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleAdditionalInformation} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const DayField = () => {
  const additional_information = useSelector((state: RootState) => state.articles.new_article?.additional_information)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['additional_information.day'])
  const dispatch = useDispatch()

  const validate = (value: string) => {
    const fieldName = 'additional_information.day'
    const fieldError: formErrors = { fieldName: fieldName, errors: [] }
    if (Number(value) > 31 || Number(value) < 1) {fieldError.errors[0] = ['Значение от 1 до 31']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    if (value) validate(value)
    dispatch(setNewArticleAdditionalInformation({day: value}))
  }


  return (
    <GridItem col={1}>
      <TextField label={'День'}
                 type={'number'}
                 incrementButtons={false}
                 min={1}
                 max={31}
                 value={additional_information?.day}
                 caption={errors && errors.join('\n')}
                 onChange={handleChange}
                 status={(errors && errors.length) ? 'alert' : undefined}
      />
    </GridItem>
  )
}