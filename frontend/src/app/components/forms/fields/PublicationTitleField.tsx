import React, {useEffect} from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {getTitleNameByReferenceType} from "../../../utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticlePublicationDetails} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const PublicationTitleField = () => {
  const reference_type = useSelector((state: RootState) => state.articles.new_article?.reference_type)
  const value = useSelector((state: RootState) => state.articles.new_article?.publication?.title)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['publication.title'])
  const dispatch = useDispatch()

  const validate = (value: string | null | undefined) => {
    const fieldName = 'publication.title'
    const fieldError: formErrors = { fieldName: fieldName, errors: [[]] }
    if (value && value.length > 300) {fieldError.errors[0].push('Введите название не более 300 символов')}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    validate(value)
    dispatch(setNewArticlePublicationDetails({title: value}))
  }

  useEffect(()=>{validate(value)}, [])

  return (
    <GridItem col={2}>
      <TextField label={getTitleNameByReferenceType(reference_type)}
                 value={value}
                 caption={errors && errors[0] && errors[0].join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={(errors && errors[0] && errors[0].length > 0) ? 'alert' : undefined}
      />
    </GridItem>
  )
}