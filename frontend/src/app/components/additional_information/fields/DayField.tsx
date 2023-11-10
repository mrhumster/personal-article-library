import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setAdditionalInformation} from "../../../features/article";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import React, {useEffect, useState} from "react";

export const DayField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.day)
  const [error, setError] = useState<string | undefined>(undefined)
  const dispatch = useDispatch()

  const handleChange = ({value}:{value: string | null}) => {
    dispatch(setAdditionalInformation({day: Number(value)}))
  }

  const validate = (value: string | undefined) => {
  }

  useEffect(()=>{
    validate(value)
  }, [value])

  return (
    <GridItem col={1}>
      <TextField size={'s'}
                 width={'full'}
                 label={'День'}
                 type={'number'}
                 min={1} max={31}
                 incrementButtons={false}
                 onChange={handleChange}
                 value={value}
                 status={error ? 'alert' : undefined}
                 caption={error && error}
      />
    </GridItem>
  )
}