import {TextField} from "@consta/uikit/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setIdentifiers} from "../../features/article";

export const ISBNField = () => {
  const value = useSelector((state: RootState) => state.articles.current_article?.identifiers?.isbn.value)
  const dispatch = useDispatch()

  const setValue = (value: string | null) => {
    dispatch(setIdentifiers({isbn: {value: value}}))
  }
  return (
    <div className={"border border-sky-700 rounded p-4"}>
      <TextField size='s' label='ISBN'
                 value={value}
                 placeholder='Введите значение ISBN'
                 onChange={setValue}/>
    </div>
  )
}