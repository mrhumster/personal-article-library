import React from "react";
import {Text} from "@consta/uikit/Text";

export const ArticleUrlsNoExpandedNoUrls = ({setIsExpanded}:{setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <Text className={"border border-dotted border-transparent hover:border-sky-700 rounded p-1"}
          size={'s'}
          weight={'light'}
          cursor={'pointer'}
          fontStyle={'italic'}
    >
      <span onClick={() => setIsExpanded(true)}>Добавить URL</span>
    </Text>
  )
}