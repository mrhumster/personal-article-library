import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {FieldLabel} from "@consta/uikit/FieldLabel";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticlePublicationDetails} from "../../../features/article";
import {formErrors} from "../../../types";
import {setFormErrorByFieldName} from "../../../features/ui";


export const PagesField = () => {
  const pages = useSelector((state: RootState) => state.articles.new_article?.publication?.pages)
  const errorsStart = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['publication.pages.start'])
  const errorsEnd = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['publication.pages.end'])
  const dispatch = useDispatch()

  const handleChangeStart = (value: string | null) => {
    if (value) validate(value, 'publication.pages.start')
    dispatch(setNewArticlePublicationDetails({pages: {start: value, end: pages?.end}}))
  }

  const handleChangeEnd = (value: string | null) => {
    if (value) validate(value, 'publication.pages.end')
    dispatch(setNewArticlePublicationDetails({pages: {start: pages?.start, end: value}}))
  }

  const validate = (value: string, field: string) => {
    const fieldError: formErrors = { fieldName: field, errors: [] }
    if (Number(value) < 0 || Number(value) > 999999) {fieldError.errors[0] = ['Значение от 0 до 999999']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  return (
    <GridItem col={2}>
      <FieldLabel className={'mb-1'} >Страницы</FieldLabel>
      <FieldGroup>
          <TextField placeholder={'c'}
                     type={'number'}
                     min={0}
                     incrementButtons={false}
                     value={pages?.start}
                     caption={errorsStart && errorsStart.join('\n')}
                     status={(errorsStart && errorsStart.length) ? 'alert' : undefined}
                     onChange={handleChangeStart}/>
          <TextField placeholder={'по'}
                     type={'number'}
                     min={0}
                     incrementButtons={false}
                     value={pages?.end}
                     caption={errorsEnd && errorsEnd.join('\n')}
                     status={(errorsEnd && errorsEnd.length) ? 'alert' : undefined}
                     onChange={handleChangeEnd}/>
      </FieldGroup>
    </GridItem>
  )
}