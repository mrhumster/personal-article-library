import React from "react";
import {ISBNField} from "./ISBNField.tsx";

interface IdentifiersExpandedPropsIFace {
  expandedRef : React.RefObject<HTMLDivElement>
}

export const IdentifiersExpand = (props: IdentifiersExpandedPropsIFace) => {
  const {expandedRef} = props

  return (
    <div ref={expandedRef}>
      <ISBNField/>
    </div>
  )
}