import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import React from "react";
import {setAdditionalInformation} from "../../../../features/article";

export const DepartamentField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.departament)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({departament: value}))
  }

  return (
    <GridItem col={2}>
      <TextField size={'s'} label={'Департамент'} onChange={handleChange} placeholder={''} value={value}/>
    </GridItem>
  )
}