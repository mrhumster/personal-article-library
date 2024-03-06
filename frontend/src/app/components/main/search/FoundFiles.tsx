import React from "react";
import { IconDocFilled } from '@consta/icons/IconDocFilled';
import {Informer} from "@consta/uikit/Informer";

const prettyHighlight = (value: string) => {
  return value.replace('-\n', '').replace('\n', '<br />')
}

export const FoundFiles = ({item}:{item: any}) => {
  const label = <div>
    <p className={'pb-3'}>{item.fields.file_name}</p>
    {item.highlight['attachment.content'].map((highlight: string, key: number) => {
      return <div className={'border rounded shadow p-2 my-2 font-light'} key={key}
                  dangerouslySetInnerHTML={{__html: prettyHighlight(highlight) }}/>
    })}
  </div>
  console.log(item)
  return (
    <Informer className={'cursor-pointer hover:bg-gray-100'}
              label={label}
              status={'success'}
              icon={IconDocFilled}
              view={'bordered'} size={'s'}/>
  )
}