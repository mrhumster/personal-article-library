import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store";
import {setPublicationDetails} from "../../../../../features/article";

export const IssueField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.publication?.issue)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {dispatch(setPublicationDetails({issue: value}))}
  return (
    <GridItem col={2}>
      <TextField
        size={'s'}
        label={'Проблема'}
        onChange={handleChange}
        value={value}/>
    </GridItem>
  )
}