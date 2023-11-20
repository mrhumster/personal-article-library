import React from "react";
import {CollectionIFace} from "../../types";
import {Badge} from "@consta/uikit/Badge";
import {IconList} from "@consta/uikit/IconList";
import {setSelectedMenuItem} from "../../features/ui";
import {useDispatch} from "react-redux";

export const CollectionBadge = ({collection}:{collection: CollectionIFace}) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setSelectedMenuItem({ id: collection.id, group: 2}))
  }
  return (
      <Badge className={'m-1 cursor-pointer hover:shadow hover:border hover:border-sky-500'}
             iconLeft={IconList}
             status={'normal'}
             label={collection.title}
             size={'s'}
             view={'stroked'}
             form={'round'}
             onClick={handleClick}
      />
  )
}