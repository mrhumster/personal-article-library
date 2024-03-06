import {Card} from "@consta/uikit/Card";
import React from "react";
import {FoundArticle} from "./FoundArticle.tsx";

export const SearchResultItem = ({item}:{item: any}) => {
  return (
    <Card>
      {item._index === 'articles' && <FoundArticle item={item}/>}
    </Card>
  )
}