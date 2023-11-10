import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setAdditionalInformation} from "../../../features/article";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import React from "react";

export const MonthField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.month)
  const dispatch = useDispatch()

  const handleChange = ({value}:{value: number | null}) => {
    dispatch(setAdditionalInformation({month: value}))
  }

  return (
    <GridItem col={1}>
      <TextField size={'s'} width={'full'} label={'Месяц'} type={'number'} min={1} max={12} incrementButtons={false} onChange={handleChange} value={value}/>
    </GridItem>
  )
}