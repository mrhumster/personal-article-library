import React from "react";
import {Text} from "@consta/uikit/Text";

export const ArticleUrlsNoExpandedNoUrls = ({setIsExpanded}:{setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <Text
      className={"border border-dotted border-transparent hover:border-sky-700 rounded p-1"}
      onClick={() => setIsExpanded(true)}
      size={'s'}
      weight={'light'}
      cursor={'pointer'}
      fontStyle={'italic'}
    >
      <span>Добавить URL</span>
    </Text>
  )
}