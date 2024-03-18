import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticlePublicationDetails} from "../../../features/article";
import moment from "moment";
import {setFormErrorByFieldName} from "../../../features/ui";



export const YearField = () => {
  const value = useSelector((state: RootState) => state.articles.new_article?.publication?.year)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['publication.year'])
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {
    validate(value)
    dispatch(setNewArticlePublicationDetails({year: Number(value)}))
  }
  const validate = (value: string | null) => {
    if (value) {
      if (moment().isBefore(moment().year(Number(value)), 'year')) {
        dispatch(setFormErrorByFieldName({fieldName: 'publication.year', errors: [['Этот год еще не наступил']]}))
      }
    }
  }
  return (
    <GridItem col={2}>
      <TextField
        label={'Год'}
        type={'number'}
        value={value}
        onChange={handleChange}
        incrementButtons={false}
        placeholder={'Год публикации'}
        caption={errors && errors.join('\n')}
        status={(errors && errors.length) ? 'alert' : undefined}
      />
    </GridItem>
  )
}