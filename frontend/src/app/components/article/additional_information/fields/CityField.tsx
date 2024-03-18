import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {setAdditionalInformation} from "../../../../features/article";
import {GridItem} from "@consta/uikit/Grid";

import React, {useCallback} from "react";
import {useSuggestQuery} from "../../../../services/backend";
import {AutoComplete} from "@consta/uikit/AutoComplete";
import {useFlag} from "@consta/uikit/useFlag";
import {setActiveClickOutsideOnAdditionalInformation} from "../../../../features/ui";



export const CityField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.additional_information?.city)
  const [open, setOpen] = useFlag(false);
  const { data } = useSuggestQuery({prefix: value, field_name: 'additional_information.city'}, {skip: !value})
  const dispatch = useDispatch()


  const handleChange = (value: string | null) => {
    dispatch(setAdditionalInformation({city: value}))
  }

  const onDropdownOpen = useCallback((open: boolean) => {
    setOpen.set(open);
    dispatch(setActiveClickOutsideOnAdditionalInformation(!open))
  }, [data]);

  const getItems = () => {
    if (data && data.length > 0) {
      return data.map((el: { text: string }, index: number) => ({
        id: index,
        label: el.text,
      }));
    }
    return []
  };

  return (
    <GridItem col={2}>
      <AutoComplete size={'s'}
                    label={'Город'}
                    onChange={handleChange}
                    value={value}
                    items={getItems()}
                    dropdownOpen={open}
                    onDropdownOpen={onDropdownOpen}
                    searchFunction={(item, searchValue) => {
                      return item.label !== searchValue;
                    }}
      />
    </GridItem>
  )
}