import React, {useRef, useState} from "react";
import {PubDetailsExpanded} from "./PubDetailsExpanded.tsx";
import {PubDetailsCollapse} from "./PubDetailsCollapse.tsx";
import {useClickOutside} from "@consta/uikit/useClickOutside";

export const PubDetails = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const expandedRef = useRef<HTMLInputElement>(null)
  const handleClickOutside = () => setExpanded(false);

  useClickOutside({
    isActive: !!handleClickOutside,
    handler: handleClickOutside,
    ignoreClicksInsideRefs: [expandedRef]
  })

  const handleClickInside = () => setExpanded(true);


  if (expanded) return <PubDetailsExpanded ref={expandedRef}/>
  if (!expanded) return <PubDetailsCollapse onClick={handleClickInside}/>
}