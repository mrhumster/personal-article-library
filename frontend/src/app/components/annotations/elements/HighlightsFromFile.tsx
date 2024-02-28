import React from "react";
import {useGetFileQuery, useGetHighlightByFileQuery} from "../../../services/backend";
import {Annotation} from "./Annotation.tsx";
import {BlankedAnnotations} from "./BlankedAnnotations.tsx";
import {HighlightScheme} from "../../../types/article.types.ts";
import {IconDocFilled} from "@consta/icons/IconDocFilled";
import { Tag } from "@consta/uikit/Tag";
import { SkeletonBrick } from "@consta/uikit/Skeleton";

export const HighlightsFromFile = ({file_id}:{file_id: string}) => {
  const {
    data: dataHighlights,
    isLoading: isLoadingHighlights,
    isSuccess: isSuccessHighlights,
  } = useGetHighlightByFileQuery(file_id, {skip: !file_id})

  const {
    data: dataFile,
    isLoading: isLoadingFile,
    isSuccess: isSuccessFile
  } = useGetFileQuery(file_id, {skip: !file_id})

  return (
    <div className={'flex flex-col h-full'}>
      {isSuccessFile && dataHighlights && dataHighlights.length !== 0 && dataFile?.file_name &&
        <Tag className={'mb-3'} mode={'info'} icon={IconDocFilled} label={dataFile?.file_name} />
      }

      {isLoadingFile && <SkeletonBrick height={25} className={'rounded'}/>}

      {isSuccessHighlights && dataHighlights &&
        <div className={'grid grid-cols-1 gap-4'}>
          {dataHighlights.map((instance: HighlightScheme) =>
            <Annotation instance={instance} key={instance.id}/>
          )}
        </div>
      }

      {isLoadingHighlights &&
        <div className={'grid grid-cols-1 gap-4 mt-3'}>
          <SkeletonBrick height={60} className={'rounded'}/>
          <SkeletonBrick height={60} className={'rounded'}/>
        </div>
      }

      {dataHighlights && dataHighlights.length === 0 && <BlankedAnnotations />}
    </div>
  )
}