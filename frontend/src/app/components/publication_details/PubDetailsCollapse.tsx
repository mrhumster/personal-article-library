import React from "react";
import {publicationDetailToString} from "../../utils";
import {Text} from "@consta/uikit/Text";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

interface PubDetailsCollapseIFace {
  onClick: React.MouseEventHandler<HTMLDivElement>
}

export const PubDetailsCollapse = ({onClick}: PubDetailsCollapseIFace) => {
  const publication = useSelector((state: RootState) => state.articles.current_article?.publication)
  return (
    <div onClick={onClick}>
      <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted py-1 mb-1">
        {publicationDetailToString(publication)}
      </Text>
    </div>
  )
}