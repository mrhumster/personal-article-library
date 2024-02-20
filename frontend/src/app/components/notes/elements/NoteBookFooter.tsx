import React, {useEffect} from "react";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/icons/IconAdd"
import {useCreateNoteBookMutation} from "../../../services/backend";
import {useDispatch} from "react-redux";
import {addNoteBook} from "../../../features/article";

export const NoteBookFooter = () => {
  const [createNoteBook,{isSuccess, data}] = useCreateNoteBookMutation()
  const dispatch = useDispatch()

  useEffect(() => {if (data) {dispatch(addNoteBook(data.id))}}, [isSuccess, data])

  const handleClick = () => {createNoteBook({title: null, body: null})}

  return (
    <div className='flex items-center h-14 px-2 bg-zinc-200'>
      <Button label='Новая страница' iconLeft={IconAdd} view='clear' onClick={handleClick}/>
    </div>
  )
}