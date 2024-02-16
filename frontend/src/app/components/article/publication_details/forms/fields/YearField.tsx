import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store";
import {setPublicationDetails} from "../../../../../features/article";

export const YearField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.publication?.year)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {dispatch(setPublicationDetails({year: value}))}
  return (
    <GridItem>
      <TextField
        size={'s'}
        label={'Год'}
        type={'number'}
        max={2100}
        min={1800}
        incrementButtons={false}
        placeholder={'Год публикации'}
        onChange={handleChange}
        value={value}
      />
    </GridItem>
  )
}