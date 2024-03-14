import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import React from "react";
import {setAdditionalInformation} from "../../../../features/article";

export const TypeField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.type)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({type: value}))
  }

  return (
    <GridItem col={2}>
      <TextField size={'s'} label={'Тип'} onChange={handleChange} placeholder={''} value={value}/>
    </GridItem>
  )
}