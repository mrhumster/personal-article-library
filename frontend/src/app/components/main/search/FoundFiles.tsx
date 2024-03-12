import React from "react";
import {Informer} from "@consta/uikit/Informer";
import {closeSearchDialog, openReader, openSideBar, setSelectedMenuItem} from "../../../features/ui";
import {useDispatch} from "react-redux";
import {openFile} from "../../../features/ui/uiSlice.ts";
import {useGetFileQuery} from "../../../services/backend";
import {FoundFileItemIFace} from "../../../types";

const prettyHighlight = (value: string) => {
  return value.replace('-\n', '').replace('\n', '<br />')
}

export const FoundFiles = ({item, query}:{item: FoundFileItemIFace , query: string}) => {
  const {data} = useGetFileQuery(item._id, {skip: !item._id})
  const dispatch = useDispatch()
  const label = <div>
    <p className={'pb-3'}>{item.fields.file_name}</p>
    {item.highlight['attachment.content'] && item.highlight['attachment.content'].map((highlight: string, key: number) => {
      return <blockquote className={'border rounded shadow font-light text-gray-700 p-2 py-3 my-1 font-xs'} key={key}
                  dangerouslySetInnerHTML={{__html: prettyHighlight(highlight) }}/>
    })}
  </div>

  const handleClick = () => {
    const article_id = item.fields.articles[0]
    dispatch(closeSearchDialog())
    dispatch(openSideBar({id: article_id}))
    dispatch(setSelectedMenuItem({id: '0', group: 1}))
    dispatch(openReader())
    if (data && article_id) dispatch(openFile({file: data, article_id: article_id, search_query: query}))

  }

  return (
    <Informer className={'cursor-pointer border border-green-100 hover:border-sky-500'}
              label={label}
              status={'success'}
              view={'bordered'} size={'s'}
              onClick={handleClick}
    />
  )
}