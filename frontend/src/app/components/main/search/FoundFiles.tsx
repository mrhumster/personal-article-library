import React from "react";
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import {Informer} from "@consta/uikit/Informer";
import {closeSearchDialog, openReader, openSideBar, setSelectedMenuItem} from "../../../features/ui";
import {useDispatch} from "react-redux";
import {openFile} from "../../../features/ui/uiSlice.ts";
import {useGetFileQuery} from "../../../services/backend";

const prettyHighlight = (value: string) => {
  return value.replace('-\n', '').replace('\n', '<br />')
}

export const FoundFiles = ({item, query}:{item: any, query: string}) => {
  const {data} = useGetFileQuery(item._id, {skip: !item._id})
  const dispatch = useDispatch()
  const label = <div>
    <p className={'pb-3'}>{item.fields.file_name}</p>
    {item.highlight['attachment.content'].map((highlight: string, key: number) => {
      return <div className={'border rounded shadow p-2 my-2 font-light'} key={key}
                  dangerouslySetInnerHTML={{__html: prettyHighlight(highlight) }}/>
    })}
  </div>

  const handleClick = () => {
    console.log(item)
    const article_id = item.fields.articles[0]
    dispatch(closeSearchDialog())
    dispatch(openSideBar({id: article_id}))
    dispatch(setSelectedMenuItem({id: '0', group: 1}))
    dispatch(openReader())
    if (data && article_id) dispatch(openFile({file: data, article_id: article_id, search_query: query}))

  }

  return (
    <Informer className={'cursor-pointer hover:bg-gray-100'}
              label={label}
              status={'success'}
              icon={IconDocFilled}
              view={'bordered'} size={'s'}
              onClick={handleClick}
    />
  )
}