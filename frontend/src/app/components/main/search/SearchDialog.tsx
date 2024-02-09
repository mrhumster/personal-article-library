import React, {useEffect, useRef, useState} from "react";
import {Button} from "@consta/uikit/Button";
import {IconSearchStroked} from "@consta/icons/IconSearchStroked";
import {TextField} from "@consta/uikit/TextField";

interface SearchDialogPropsIFace {
  searchValue?: string | null,
  setSearchValue: React.Dispatch<React.SetStateAction<string | undefined | null>>
}

export const SearchDialog = (props: SearchDialogPropsIFace) => {
  const {searchValue, setSearchValue} = props
  const [showInput, setShowInput] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      if (!searchValue) setShowInput(false)
    }
  }

  const handleClickInside = () => setShowInput(true);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });


  return (
    <div className='p-1 my-auto flex ms-10 me-2'>
      { !showInput && <Button label='Поиск' size={'s'} view={'clear'} iconLeft={IconSearchStroked} onClick={handleClickInside}/> }
      { showInput &&
          <TextField
              style={{width: '200px'}}
              size={'xs'}
              ref={ref}
              onChange={setSearchValue}
              value={searchValue}
              withClearButton
              leftSide={IconSearchStroked}
          />
      }
    </div>
  )
}