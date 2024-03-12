import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {setAdditionalInformation} from "../../../../features/article";
import {GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import React, {useEffect} from "react";
import {useSuggestQuery} from "../../../../services/backend";
import {AutoComplete} from "@consta/uikit/AutoComplete";

export const CityField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.city)
  const {data} = useSuggestQuery({prefix: value, field_name: 'additional_information.city'}, {skip: !value})

  const dispatch = useDispatch()

  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({city: value}))
  }

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

  const getMailItems = () => {
    if (data && data.length > 0) {
      return data.map((el, index) => ({
        id: index,
        label: el.text,
      }));
    }
    return []
  };

  return (
    <GridItem col={1}>
      <AutoComplete size={'s'} label={'Город'} onChange={handleChange} value={value} items={getMailItems()}/>
    </GridItem>
  )
}