import React, {useState} from "react";
import {IdentifiersExpand} from "./IdentifiersExpand.tsx";
import {IdentifiersCollapse} from "./IdentifiersCollapse.tsx";
import {useClickOutside} from "@consta/uikit/useClickOutside";


export const Identifiers = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const handleClickOutside = () => {
    console.log('click identifiers outside')
    setIsExpanded(false)
  }
  // TODO: Не работает хер знает почему
  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside
  })

  return (
    <div id="identifiers" className="my-3">
      <span className={'ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'}>Идентификаторы</span>
      {  isExpanded && <IdentifiersExpand  setIsExpanded={setIsExpanded}/>}
      { !isExpanded && <IdentifiersCollapse setIsExpanded={setIsExpanded}/>}
    </div>
  )
}