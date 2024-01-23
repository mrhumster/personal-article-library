import React from "react";
import {CollectionIFace} from "../../types";
import {Badge} from "@consta/uikit/Badge";
import {IconList} from "@consta/icons/IconList";
import {setSelectedMenuItem} from "../../features/ui";
import {useDispatch} from "react-redux";
import {truncateString} from "../../utils";

export const ArticleCollectionBadge = ({collection}:{collection: CollectionIFace}) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setSelectedMenuItem({ id: collection.id, group: 2}))
  }
  return (
      <Badge className={'m-1 cursor-pointer hover:shadow hover:border hover:border-zinc-500'}
             iconLeft={IconList}
             status={'system'}
             label={truncateString(collection.title, 20)}
             size={'s'}
             view={'filled'}
             onClick={handleClick}
      />
  )
}