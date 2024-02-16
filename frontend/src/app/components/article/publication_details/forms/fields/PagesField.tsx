import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store";
import {setPublicationDetails} from "../../../../../features/article";

export const PagesField = () => {
  const pages = useSelector((state: RootState) => state.articles.current_article?.publication?.pages)
  const dispatch = useDispatch()
  const handleChangeStart = (value: string | null) => {dispatch(setPublicationDetails({pages: {start: value, end: pages?.end}}))}
  const handleChangeEnd = (value: string | null) => {dispatch(setPublicationDetails({pages: {start: pages?.start, end: value }}))}

  return (
    <GridItem className={'flex items-end'}>
      <TextField size={'s'} className={'self-end me-1 w-24'} type={'number'} min={1} max={10000}
                 incrementButtons={false} label={'Страницы'}
                 onChange={handleChangeStart}
                 value={pages?.start}
                 placeholder={'c'}
      />
      <TextField size={'s'} className={'self-end ms-1 w-24'} type={'number'} min={1} max={10000}
                 incrementButtons={false}
                 onChange={handleChangeEnd}
                 value={pages?.end}
                 placeholder={'по'}
      />
    </GridItem>
  )
}