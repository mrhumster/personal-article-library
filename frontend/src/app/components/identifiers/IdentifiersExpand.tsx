import React from "react";
import {TextField} from "@consta/uikit/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setIdentifiers} from "../../features/article";
interface IdentifiersExpandedPropsIFace {
  expandedRef : React.RefObject<HTMLDivElement>
}

export const IdentifiersExpand = (props: IdentifiersExpandedPropsIFace) => {
  const { expandedRef} = props
  const identifiers = useSelector((state: RootState) => state.articles.current_article?.identifiers)
  const dispatch = useDispatch()
  const handleChangeISBN = ({ value }:{value: string | null}) => {
    dispatch(setIdentifiers({isbn: { isbn13: value } }))
  }

  return (
    <div ref={expandedRef} className={"border border-sky-700 rounded p-4"}>
      <TextField size='s' width='full' label='ISBN 13' value={identifiers?.isbn.isbn13} placeholder='Введите значение ISBN'
                 onChange={handleChangeISBN}/>
    </div>
  )
}