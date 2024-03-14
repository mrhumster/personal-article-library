import React from "react";
import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {setAdditionalInformation} from "../../../../features/article";

export const CountryField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.country)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({country: value}))
  }

  return (
    <GridItem col={2}>
      <TextField size={'s'} label={'Страна'} onChange={handleChange} placeholder={''} value={value}/>
    </GridItem>
  )
}