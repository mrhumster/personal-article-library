import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticlePublicationDetails} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";

export const VolumeField = () => {
  const publication = useSelector((state: RootState) => state.articles.new_article?.publication)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['publication.volume'])
  const dispatch = useDispatch()

  const validate = (value: string) => {
    const fieldName = 'publication.volume'
    const fieldError: formErrors = { fieldName: fieldName, errors: [] }
    if (value.length > 100) {fieldError.errors[0] = ['Введите название не более 100 символов']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    if (value) validate(value)
    dispatch(setNewArticlePublicationDetails({volume: value}))
  }


  return (
    <GridItem col={1}>
      <TextField label={'Том'}
                 value={publication?.volume}
                 caption={errors && errors.join('\n')}
                 onChange={handleChange}
                 withClearButton
                 placeholder={'I, II, III, IV, ...'}
                 status={(errors && errors.length) ? 'alert' : undefined}
      />
    </GridItem>
  )
}