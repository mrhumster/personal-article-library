import React from "react";
import {Button} from "@consta/uikit/Button";
import {IconSearchStroked} from "@consta/icons/IconSearchStroked";
import {useDispatch} from "react-redux";
import {openSearchDialog} from "../../../features/ui";

export const ElasticSearch = () => {
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(openSearchDialog())
  }
  return (
  <div className='p-1 my-auto flex ms-10 me-2'>
    <Button
      label={'Поиск'}
      view={'clear'}
      iconLeft={IconSearchStroked}
      size={'s'}
      onClick={handleClick}
    />
  </div>
  )
}