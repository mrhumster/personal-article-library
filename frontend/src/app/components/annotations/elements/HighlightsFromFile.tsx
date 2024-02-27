import React from "react";
import {useGetFileQuery, useGetHighlightByFileQuery} from "../../../services/backend";
import {Annotation} from "./Annotation.tsx";
import {HighlightScheme} from "../../../types/article.types.ts";
import { Tag } from "@consta/uikit/Tag";
import {IconDocFilled} from "@consta/icons/IconDocFilled";

export const HighlightsFromFile = ({file_id}:{file_id: string}) => {
  const {data} = useGetHighlightByFileQuery(file_id, {skip: !file_id})
  const {data: dataFile, isLoading} = useGetFileQuery(file_id, {skip: !file_id})
  return (
    <div>
      <Tag icon={IconDocFilled} label={dataFile?.file_name} />
      {data && data.map((instance: HighlightScheme) => <Annotation instance={instance} key={instance.id} />)}
    </div>
  )
}