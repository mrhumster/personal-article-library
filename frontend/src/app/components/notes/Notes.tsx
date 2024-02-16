import React from "react";
import {NoteBookBody, NoteBookFooter} from "./parts";

export const Notes = () => {
  return (
    <div id='notebook' className='flex flex-col'>
      <NoteBookBody />
      <NoteBookFooter />
    </div>
  )
}