import React from "react";
import {GridItem} from "@consta/uikit/Grid";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setNewArticleAdditionalInformation} from "../../../features/article";
import {setFormErrorByFieldName} from "../../../features/ui";
import {formErrors} from "../../../types";
import {useSuggestQuery} from "../../../services/backend";
import {AutoComplete} from "@consta/uikit/AutoComplete";

export const PublisherField = () => {
  const additional_information = useSelector((state: RootState) => state.articles.new_article?.additional_information)
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors['additional_information.publisher'])
  const { data } = useSuggestQuery({prefix: additional_information?.publisher, field_name: 'additional_information.publisher'}, {skip: !additional_information?.publisher})
  const dispatch = useDispatch()

  const validate = (value: string) => {
    const fieldName = 'additional_information.publisher'
    const fieldError: formErrors = { fieldName: fieldName, errors: [] }
    if (value.length > 200) {fieldError.errors[0] = ['Введите название не более 200 символов']}
    dispatch(setFormErrorByFieldName(fieldError))
  }

  const handleChange = (value: string | null) => {
    if (value) validate(value)
    dispatch(setNewArticleAdditionalInformation({publisher: value}))
  }

  const getItems = () => {
    if (data && data.length > 0) {
      return data.map((el: { text: string }, index: number) => ({
        id: index,
        label: el.text,
      }));
    }
    return []
  };

  return (
    <GridItem col={2}>
      <AutoComplete label={'Издатель'}
                 value={additional_information?.publisher}
                 caption={errors && errors.join('\n')}
                 onChange={handleChange}
                 withClearButton
                 status={(errors && errors.length) ? 'alert' : undefined}
                 items={getItems()}
                 searchFunction={(item, searchValue) => {
                    return item.label !== searchValue;
                 }}
      />
    </GridItem>
  )
}