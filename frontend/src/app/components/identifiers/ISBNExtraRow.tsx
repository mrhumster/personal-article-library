import {Button} from "@consta/uikit/Button";
import {IconLightningBolt} from "@consta/uikit/IconLightningBolt";
import React, {useState} from "react";
import {truncateString} from "../../utils";

interface ISBNExtraRowIFace {
  label: string
  content?: string | string[]
  callback?: (e: React.MouseEvent) => Promise<void>
}

export const ISBNExtraContentList = ({content}: {content: string[]}) => {
  return (
    content.map((item, key) => <div key={key}>{item}</div>)
  )
}

export const ISBNEXtraContentText = ({content}: {content: string}) => {
  const [expand, setExpand] = useState<boolean>(false)
  const handleClickExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpand(!expand)
  }
  if (content.toString().length <= 50) return <span>{content}</span>

  return (
    <>
      {
        expand ?
          <span>{content}
            <div className='text-sky-500 cursor-pointer underline' onClick={handleClickExpand}>меньше...</div>
          </span> :
          <span>{truncateString(content, 100)}
            <div className='text-sky-500 cursor-pointer underline' onClick={handleClickExpand}>больше...</div>
          </span>
      }
    </>
  )
}

export const ISBNExtraRow = (props: ISBNExtraRowIFace) => {
  return (
    <>
      {props.content &&
          <>
              <div className='my-auto text-xs text-slate-500 pt-0'>{props.label}</div>
              <div className="my-auto">
                {typeof props.content === 'object' ?
                  <ISBNExtraContentList content={props.content}/> :
                  <ISBNEXtraContentText content={props.content}/>
                }
              </div>
            {props.callback ?
              <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                      title='Использовать это значение' view='clear' size='s' form='round'
                      onClick={props.callback}
              /> :
              <span></span>
            }
          </>
      }
    </>
  )
}