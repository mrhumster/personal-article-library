import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {setPublicationDetails} from "../../../../features/article";

export const VolumeField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.publication?.volume)
  const dispatch = useDispatch()
  const handleChange = (value: string | null) => {dispatch(setPublicationDetails({volume: value}))}
  return (
    <GridItem col={2}>
      <TextField
        size={'s'}
        label={'Том'}
        onChange={handleChange}
        value={value}
      />
    </GridItem>
  )
}