import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import React from "react";
import {getTitleNameByReferenceType} from "../../../../../utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store";
import {setPublicationDetails} from "../../../../../features/article";

export const TitleField = () => {
  const reference_type = useSelector((state: RootState) => state.articles.current_article?.reference_type)
  const value = useSelector((state: RootState) => state.articles.current_article?.publication?.title)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {dispatch(setPublicationDetails({title: value}))}
  return (
    <GridItem col={2}>
      <TextField
        size={'s'}
        label={getTitleNameByReferenceType(reference_type)}
        placeholder={getTitleNameByReferenceType(reference_type)}
        onChange={handleChange}
        value={value}/>
    </GridItem>
  )
}