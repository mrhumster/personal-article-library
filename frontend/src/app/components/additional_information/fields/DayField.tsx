import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setAdditionalInformation} from "../../../features/article";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import React, {useEffect, useState} from "react";
import {isNumber} from "@consta/uikit/__internal__/src/utils/type-guards";

export const DayField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.day)
  const [error, setError] = useState<string | undefined>(undefined)
  const dispatch = useDispatch()

  const handleChange = ({value}:{value: string | null}) => {
    dispatch(setAdditionalInformation({day: value}))
  }

  const validate = (value: string | undefined) => {
    console.log((/^[0-3]?[0-9]{1}$/.test(value) && Number(value) > 0 && Number(value) < 32))
    if (value) {
      if (/^[0-3]?[0-9]{1}$/.test(value) && Number(value) > 0 && Number(value) < 32) {
        setError(undefined)
      } else {
        setError('Только числа от 1 до 31')
      }
    } else {
      setError(undefined)
    }
  }

  useEffect(()=>{
    validate(value)
  }, [value])


  return (
    <GridItem col={1}>
      <TextField size={'s'}
                 width={'full'}
                 label={'День'}
                 onChange={handleChange}
                 value={value}
                 status={error ? 'alert' : undefined}
                 caption={error && error}
      />
    </GridItem>
  )
}