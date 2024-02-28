import React from "react";
import {Text} from "@consta/uikit/Text"
import {truncateString} from "../../../utils";
import {useFlag} from "@consta/uikit/useFlag";

export const Quote = ({text}:{text: string}) => {
  const [isExpanded, setIsExpanded] = useFlag(false)
  return (
    <Text className={'cursor-pointer bg-gray-100 rounded p-2'}
          size={'xs'}
          view={'secondary'}
          onClick={isExpanded ? setIsExpanded.off : setIsExpanded.on}
    >
      {isExpanded ? text : truncateString(text,50)}
    </Text>
  )}