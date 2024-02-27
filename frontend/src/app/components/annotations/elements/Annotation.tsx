import React from "react";
import {HighlightScheme} from "../../../types/article.types.ts";
import {Informer} from "@consta/uikit/Informer";
import {Text} from "@consta/uikit/Text"

export const Annotation = ({instance}:{instance: HighlightScheme}) => {
  return (
    <Informer className={'cursor-pointer my-1'} view={'bordered'} size={'s'} title={instance.content} label={<Text truncate>{instance.quote}</Text>} />
  )
}