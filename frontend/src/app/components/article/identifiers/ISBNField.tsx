import {TextField} from "@consta/uikit/TextField";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setIdentifiers} from "../../../features/article";
import {Button} from "@consta/uikit/Button";
import {IconSave} from "@consta/icons/IconSave"

export const ISBNField = () => {
  const [localValue, setLocalValue] = useState<string | null>(null)
  const value = useSelector((state: RootState) => state.articles.current_article?.identifiers?.isbn.value)
  const dispatch = useDispatch()

  useEffect(() => {
    if (value) setLocalValue(value)
    else setLocalValue(null)
  }, [value])

  const handleSubmit = () => {
    dispatch(setIdentifiers({isbn: {value: localValue}}))
  }


  return (
    <div className={"flex  border border-sky-700 rounded p-4"}>
      <TextField
        size='s'
        label='ISBN'
        value={localValue}
        placeholder='Введите значение ISBN'
        form='defaultBrick'
        onChange={setLocalValue}
      />
      <Button
        className='mt-auto'
        onClick={handleSubmit}
        view='clear'
        onlyIcon
        iconLeft={IconSave}
        form='brickDefault'
        size='s'
      />
    </div>
  )
}