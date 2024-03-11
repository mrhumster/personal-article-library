import React from "react";
import {IconSearchStroked} from "@consta/icons/IconSearchStroked";
import {useDispatch} from "react-redux";
import {openSearchDialog} from "../../../features/ui";
import { useHotkeys } from 'react-hotkeys-hook';

export const ElasticSearch = () => {
  const dispatch = useDispatch()
  const handleClick = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault()
    dispatch(openSearchDialog())
  }

  useHotkeys('Ctrl+F', (e: React.KeyboardEvent) => handleClick(e))

  return (
  <button className="py-1 px-2 mx-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 hover:shadow-md disabled:opacity-50 disabled:pointer-events-none active:bg-zinc-200  active:shadow-inner"
          onClick={(e: React.MouseEvent) => handleClick(e)}>
    <IconSearchStroked className={'my-auto mx-1'} size={'s'}/>
    <p className={'mx-1 self-center'}>Поиск...</p>
    <p className={'mx-1 self-center'}>
      <kbd className="min-h-[20px] inline-flex justify-center items-center py-1 px-1 bg-white border border-gray-200 font-mono text-xs text-gray-800 rounded-md">Ctrl</kbd>+
      <kbd className="min-h-[20px] inline-flex justify-center items-center py-1 px-1 bg-white border border-gray-200 font-mono text-xs text-gray-800 rounded-md">F</kbd></p>
  </button>
  )
}