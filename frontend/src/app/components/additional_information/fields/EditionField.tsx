import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import React from "react";
import {setAdditionalInformation} from "../../../features/article";

export const EditionField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.edition)
  const dispatch = useDispatch()
  const handleChange = ({value}:{value: string | null}) => {
    dispatch(setAdditionalInformation({edition: value}))
  }

  return (
    <GridItem col={2}>
      <TextField size={'s'} width={'full'} label={'Издание'} onChange={handleChange} placeholder={'Введите название издания'} value={value}/>
    </GridItem>
  )
}