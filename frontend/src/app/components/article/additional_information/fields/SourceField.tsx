import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import React from "react";
import {setAdditionalInformation} from "../../../../features/article";

export const SourceField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.source)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({source: value}))
  }

  return (
    <GridItem col={2}>
      <TextField size={'s'} label={'Источник'} onChange={handleChange} placeholder={''} value={value}/>
    </GridItem>
  )
}