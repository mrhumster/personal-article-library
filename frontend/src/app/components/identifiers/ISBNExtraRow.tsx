import {Button} from "@consta/uikit/Button";
import {IconLightningBolt} from "@consta/uikit/IconLightningBolt";
import React from "react";

interface ISBNExtraRowIFace {
  label: string
  content?: string | string[]
  callback?: (e: React.MouseEvent) => Promise<void>
}

export const ISBNExtraRow = (props: ISBNExtraRowIFace) => {
  return (
    <>
      {props.content &&
          <>
              <div className='my-auto text-xs text-slate-500 pt-0'>{props.label}</div>
              <div className="my-auto">
                {typeof props.content === 'object' ?
                  props.content.map((item, key) => <div key={key}>{item}</div>) :
                  <span>{props.content}</span>
                }
              </div>
            { props.callback ?
              <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                      title='Использовать это значение' view='clear' size='s' form='round'
                      onClick={props.callback}
              />:
              <span></span>
            }
          </>
      }
    </>
  )
}