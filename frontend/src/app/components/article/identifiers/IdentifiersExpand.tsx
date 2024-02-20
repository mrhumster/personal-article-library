import React from "react";
import {ISBNField} from "./ISBNField.tsx";

interface propsIFace {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const IdentifiersExpand = ({setIsExpanded}:propsIFace) => {
  return (
    <div>
      <ISBNField setIsExpanded={setIsExpanded}/>
    </div>
  )
}