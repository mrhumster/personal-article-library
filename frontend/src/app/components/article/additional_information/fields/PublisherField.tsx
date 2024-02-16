import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {setAdditionalInformation} from "../../../../features/article";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import React from "react";

export const PublisherField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.publisher)
  const dispatch = useDispatch()

  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({publisher: value}))
  }

  return (
    <GridItem col={1}>
      <TextField size={'s'} label={'Издатель'} onChange={handleChange} value={value}/>
    </GridItem>
  )
}