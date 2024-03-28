import React, {useEffect, useRef} from "react";
import {AvatarGroup} from "@consta/uikit/AvatarGroup";
import {AuthorIFace} from "../../../types";
import {authorToString} from "../../../utils";

export const AuthorsCell = ({items}:{items: AuthorIFace[] | undefined}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && items) ref.current.title = items.map((item) => authorToString(item)).join('\n')
  }, [ref])

  if (items) {
    return (
      <AvatarGroup
        items={items}
        size={'xs'}
        getItemName={(item: AuthorIFace) => `${item.last_name} ${item.first_name} ${item.sur_name}`}
        ref={ref}
      />
    )
  } else {
    return null
  }
}